import * as vscode from 'vscode';
import { CommandName } from './registry';
import {
    applyEdits,
    replaceDocumentText,
    insertAtCursors,
    getTabSize,
    isFileWithinLimit,
    formatFileTooLargeMessage,
    TextEdit,
} from '../utils/editor';
import { runWithProgress } from '../utils/progress';
import { planSelectionEdits, applyPlannedEdits, PlannedEdit, SelectionRange } from '../core/planEdits';
import { recordLastCommand } from '../utils/history';
import { confirmWithPreview, isPreviewEnabled } from '../utils/preview';
import { DESTRUCTIVE_COMMANDS } from './destructive';
import { macroRecorder } from '../macro/recorder';

function recordCommandAction(context: vscode.ExtensionContext, command: CommandName): void {
    void recordLastCommand(context, command);
    macroRecorder.record({ type: 'command', command });
}

export type TransformOutput = string | { result: string; error?: string; warning?: string };
export type TransformFn = (text: string, tabSize: number) => TransformOutput | Promise<TransformOutput>;
export type InsertFn = () => TransformOutput | Promise<TransformOutput>;
export type InfoFn = () => string | Promise<string>;
export type LineTransformFn = (text: string, lineIndices: number[], tabSize: number) => TransformOutput | Promise<TransformOutput>;
export type DocumentTransformFn = (documentText: string, pattern: string, tabSize: number) => TransformOutput | Promise<TransformOutput>;

interface TextCommandOptions {
    command: CommandName;
    transform: TransformFn;
    needsProgress?: boolean;
}

interface LineCommandOptions {
    command: CommandName;
    transform: LineTransformFn;
    needsProgress?: boolean;
}

interface InsertCommandOptions {
    command: CommandName;
    insert: InsertFn;
}

interface InfoCommandOptions {
    command: CommandName;
    info: InfoFn;
}

interface DocumentCommandOptions {
    command: CommandName;
    transform: DocumentTransformFn;
}

function processResult<T>(result: T | { result: T; error?: string; warning?: string }): { value: T; error?: string; warning?: string } {
    if (typeof result === 'object' && result !== null && 'result' in result) {
        const r = result as { result: T; error?: string; warning?: string };
        return { value: r.result, error: r.error, warning: r.warning };
    }
    return { value: result as T };
}

function reportProcessed(processed: { error?: string; warning?: string }): void {
    if (processed.error) {
        vscode.window.showWarningMessage(vscode.l10n.t('Pancho: {0}', processed.error));
    } else if (processed.warning) {
        vscode.window.showWarningMessage(vscode.l10n.t('Pancho: {0}', processed.warning));
    }
}

function shouldShowProgress(textLength: number): boolean {
    return textLength > 100000;
}

function noopToken(): vscode.CancellationToken {
    return {
        isCancellationRequested: false,
        onCancellationRequested: () => ({ dispose: () => {} }),
    };
}

const noopProgress: vscode.Progress<{ message?: string; increment?: number }> = { report: () => {} };

async function runOperation(
    command: CommandName,
    inputLength: number,
    needsProgress: boolean,
    operation: (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => Promise<void>
): Promise<void> {
    if (needsProgress || shouldShowProgress(inputLength)) {
        await runWithProgress(vscode.l10n.t('Running {0}...', command), operation, true);
    } else {
        await operation(noopProgress, noopToken());
    }
}

function toVscodeEdits(document: vscode.TextDocument, edits: PlannedEdit[]): TextEdit[] {
    return edits.map(edit => ({
        range: new vscode.Range(document.positionAt(edit.start), document.positionAt(edit.end)),
        text: edit.text,
    }));
}

function selectionRanges(editor: vscode.TextEditor): SelectionRange[] {
    return editor.selections.map(selection => ({
        start: editor.document.offsetAt(selection.start),
        end: editor.document.offsetAt(selection.end),
    }));
}

function touchedLineIndices(editor: vscode.TextEditor): number[] {
    const lines = new Set<number>();
    for (const selection of editor.selections) {
        for (let line = selection.start.line; line <= selection.end.line; line++) {
            lines.add(line);
        }
    }
    return Array.from(lines).sort((a, b) => a - b);
}

export function registerTextCommand(context: vscode.ExtensionContext, options: TextCommandOptions): void {
    const { command, transform, needsProgress = false } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                    return;
                }
                recordCommandAction(context, command);

                const fullText = editor.document.getText();
                if (!isFileWithinLimit(fullText)) {
                    vscode.window.showWarningMessage(formatFileTooLargeMessage(fullText));
                    return;
                }

                const tabSize = getTabSize();
                const ranges = selectionRanges(editor);
                const wholeDocument = editor.selections.length === 1 && editor.selections[0].isEmpty;
                const inputLength = wholeDocument
                    ? fullText.length
                    : ranges.reduce((max, range) => Math.max(max, range.end - range.start), 0);

                let value: string | undefined;
                let edits: PlannedEdit[] | undefined;
                let error: string | undefined;
                let warning: string | undefined;
                let cancelled = false;

                await runOperation(command, inputLength, needsProgress, async (_progress, token) => {
                    if (token.isCancellationRequested) {
                        cancelled = true;
                        return;
                    }
                    if (wholeDocument) {
                        const processed = processResult(await transform(fullText, tabSize));
                        value = processed.value;
                        error = processed.error;
                        warning = processed.warning;
                    } else {
                        const plan = await planSelectionEdits(fullText, ranges, text => transform(text, tabSize));
                        if (plan.error) {
                            error = plan.error;
                            return;
                        }
                        warning = plan.warning;
                        edits = plan.edits;
                    }
                    if (token.isCancellationRequested) cancelled = true;
                });

                if (cancelled) return;
                reportProcessed({ error, warning });
                if (error) return;
                if (wholeDocument && value === undefined) return;

                if (DESTRUCTIVE_COMMANDS.has(command) && isPreviewEnabled()) {
                    const modified = wholeDocument ? value! : applyPlannedEdits(fullText, edits ?? []);
                    if (!(await confirmWithPreview(fullText, modified, command))) return;
                }

                if (wholeDocument) {
                    await replaceDocumentText(() => value!);
                } else if (edits) {
                    await applyEdits(editor, toVscodeEdits(editor.document, edits));
                }
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}

export function registerLineCommand(context: vscode.ExtensionContext, options: LineCommandOptions): void {
    const { command, transform, needsProgress = false } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                    return;
                }

                const fullText = editor.document.getText();
                if (!isFileWithinLimit(fullText)) {
                    vscode.window.showWarningMessage(formatFileTooLargeMessage(fullText));
                    return;
                }

                recordCommandAction(context, command);

                const tabSize = getTabSize();
                const lineIndices = touchedLineIndices(editor);
                let value: string | undefined;
                let error: string | undefined;
                let warning: string | undefined;

                await runOperation(command, fullText.length, needsProgress, async (_progress, token) => {
                    if (token.isCancellationRequested) return;
                    const processed = processResult(await transform(fullText, lineIndices, tabSize));
                    value = processed.value;
                    error = processed.error;
                    warning = processed.warning;
                });

                reportProcessed({ error, warning });
                if (error || value === undefined) return;
                if (DESTRUCTIVE_COMMANDS.has(command) && isPreviewEnabled()) {
                    if (!(await confirmWithPreview(fullText, value, command))) return;
                }
                await replaceDocumentText(() => value!);
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}

export function registerInsertCommand(context: vscode.ExtensionContext, options: InsertCommandOptions): void {
    const { command, insert } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                void recordLastCommand(context, command);
                const processed = processResult(await insert());
                if (processed.error) {
                    reportProcessed({ error: processed.error });
                    return;
                }
                if (processed.warning) {
                    reportProcessed({ warning: processed.warning });
                }
                macroRecorder.record({ type: 'insert', text: processed.value });
                await insertAtCursors(processed.value);
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}

export function registerInfoCommand(context: vscode.ExtensionContext, options: InfoCommandOptions): void {
    const { command, info } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                vscode.window.showInformationMessage(await info());
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}

export function registerDocumentCommand(context: vscode.ExtensionContext, options: DocumentCommandOptions): void {
    const { command, transform } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                    return;
                }
                recordCommandAction(context, command);

                const fullText = editor.document.getText();
                if (!isFileWithinLimit(fullText)) {
                    vscode.window.showWarningMessage(formatFileTooLargeMessage(fullText));
                    return;
                }

                const pattern = editor.document.getText(editor.selection);
                if (!pattern) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Select text to use as pattern'));
                    return;
                }

                const processed = processResult(await transform(fullText, pattern, getTabSize()));
                reportProcessed(processed);
                if (processed.error) return;
                if (isPreviewEnabled() && !(await confirmWithPreview(fullText, processed.value, command))) return;
                await replaceDocumentText(() => processed.value);
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}

export interface PromptCommandOptions {
    command: CommandName;
    prompts: { label: string; placeholder: string; password?: boolean }[];
    transform: (text: string, ...answers: string[]) => TransformOutput | Promise<TransformOutput>;
}

export function registerPromptCommand(context: vscode.ExtensionContext, options: PromptCommandOptions): void {
    const { command, prompts, transform } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                    return;
                }
                recordCommandAction(context, command);

                const answers: string[] = [];
                for (const p of prompts) {
                    const value = await vscode.window.showInputBox({
                        prompt: p.label,
                        placeHolder: p.placeholder,
                        password: p.password,
                    });
                    if (value === undefined) return;
                    answers.push(value);
                }

                const fullText = editor.document.getText();
                if (!isFileWithinLimit(fullText)) {
                    vscode.window.showWarningMessage(formatFileTooLargeMessage(fullText));
                    return;
                }

                const ranges = selectionRanges(editor);
                const wholeDocument = editor.selections.length === 1 && editor.selections[0].isEmpty;

                let value: string | undefined;
                let edits: PlannedEdit[] | undefined;
                let error: string | undefined;
                let warning: string | undefined;

                if (wholeDocument) {
                    const processed = processResult(await transform(fullText, ...answers));
                    value = processed.value;
                    error = processed.error;
                    warning = processed.warning;
                } else {
                    const plan = await planSelectionEdits(fullText, ranges, text => transform(text, ...answers));
                    if (plan.error) error = plan.error;
                    warning = plan.warning;
                    edits = plan.edits;
                }

                if (error) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: {0}', error));
                    return;
                }
                if (warning) {
                    vscode.window.showWarningMessage(vscode.l10n.t('Pancho: {0}', warning));
                }

                if (wholeDocument) {
                    if (value === undefined) return;
                    await replaceDocumentText(() => value!);
                } else if (edits) {
                    await applyEdits(editor, toVscodeEdits(editor.document, edits));
                }
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}

export interface AsyncCommandOptions {
    command: CommandName;
    handler: () => Promise<void>;
}

export function registerAsyncCommand(context: vscode.ExtensionContext, options: AsyncCommandOptions): void {
    const { command, handler } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async () => {
            try {
                await handler();
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(vscode.l10n.t('Pancho: {0}', String(err)));
            }
        })
    );
}
