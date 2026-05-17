import * as vscode from 'vscode';
import { CommandName } from './registry';
import { getSelection, replaceSelection, replaceDocumentText, insertAtCursor, getTabSize, getDocumentText } from '../utils/editor';
import { runWithProgress } from '../utils/progress';

export type TransformFn = (text: string, tabSize: number) => string | { result: string; error?: string };
export type InsertFn = () => string | { result: string; error?: string };
export type InfoFn = () => string;

interface TextCommandOptions {
    command: CommandName;
    transform: TransformFn;
    insert?: never;
    info?: never;
    needsProgress?: boolean;
}

interface InsertCommandOptions {
    command: CommandName;
    transform?: never;
    insert: InsertFn;
    info?: never;
}

interface InfoCommandOptions {
    command: CommandName;
    transform?: never;
    insert?: never;
    info: InfoFn;
}

type CommandOptions = TextCommandOptions | InsertCommandOptions | InfoCommandOptions;

function getText(): string | undefined {
    return getSelection();
}

function getTextOrDocument(): string {
    const selection = getSelection();
    return selection !== undefined && selection.length > 0 ? selection : getDocumentText();
}

function processResult<T>(result: T | { result: T; error?: string }): { value: T; error?: string } {
    if (typeof result === 'object' && result !== null && 'result' in result) {
        const r = result as { result: T; error?: string };
        return { value: r.result, error: r.error };
    }
    return { value: result as T };
}

function getMaxFileSize(): number {
    const config = vscode.workspace.getConfiguration('pancho');
    return config.get<number>('maxFileSizeKB', 5120) * 1024;
}

function shouldShowProgress(textLength: number): boolean {
    return textLength > 100000;
}

export function registerTextCommand(context: vscode.ExtensionContext, options: TextCommandOptions): void {
    const { command, transform, needsProgress = false } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, async (args?: { pattern?: string }) => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showWarningMessage('Pancho: No hay editor activo');
                    return;
                }

                const fileSize = new TextEncoder().encode(editor.document.getText()).length;
                const maxSize = getMaxFileSize();
                if (maxSize > 0 && fileSize > maxSize) {
                    vscode.window.showWarningMessage(`Pancho: Archivo demasiado grande (${Math.round(fileSize/1024)}KB). Máximo: ${maxSize/1024}KB`);
                    return;
                }

                const tabSize = getTabSize();
                const selection = getText();
                let text = selection !== undefined && selection.length > 0 ? selection : getDocumentText();
                let value: string;
                let error: string | undefined;

                const operation = async (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => {
                    if (token.isCancellationRequested) {
                        return;
                    }

                    const result = transform(text, tabSize);
                    const processed = processResult(result);
                    value = processed.value;
                    error = processed.error;

                    if (token.isCancellationRequested) {
                        return;
                    }
                };

                if (needsProgress || shouldShowProgress(text.length)) {
                    await runWithProgress(
                        `Ejecutando ${command}...`,
                        operation,
                        true
                    );
                } else {
                    const noopProgress: vscode.Progress<{ message?: string; increment?: number }> = { report: () => {} };
                    await operation(noopProgress, { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => {} }) });
                }

                if (error) {
                    vscode.window.showWarningMessage(`Pancho: ${error}`);
                }
                replaceSelection(value!);
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(`Pancho: ${String(err)}`);
            }
        })
    );
}

export function registerInsertCommand(context: vscode.ExtensionContext, options: InsertCommandOptions): void {
    const { command, insert } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, () => {
            try {
                const result = insert();
                const processed = processResult(result);
                if (processed.error) {
                    vscode.window.showWarningMessage(`Pancho: ${processed.error}`);
                }
                insertAtCursor(processed.value);
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(`Pancho: ${String(err)}`);
            }
        })
    );
}

export function registerInfoCommand(context: vscode.ExtensionContext, options: InfoCommandOptions): void {
    const { command, info } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, () => {
            try {
                vscode.window.showInformationMessage(info());
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(`Pancho: ${String(err)}`);
            }
        })
    );
}