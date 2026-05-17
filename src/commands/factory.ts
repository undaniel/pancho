import * as vscode from 'vscode';
import { CommandName } from './registry';
import { getSelection, replaceSelection, replaceDocumentText, insertAtCursor, getTabSize, getDocumentText } from '../utils/editor';

export type TransformFn = (text: string, tabSize: number) => string | { result: string; error?: string };
export type InsertFn = () => string | { result: string; error?: string };
export type InfoFn = () => string;

interface TextCommandOptions {
    command: CommandName;
    transform: TransformFn;
    insert?: never;
    info?: never;
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

export function registerTextCommand(context: vscode.ExtensionContext, options: TextCommandOptions): void {
    const { command, transform } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, () => {
            try {
                const tabSize = getTabSize();
                const selection = getText();
                let value: string;
                let error: string | undefined;

                if (selection !== undefined && selection.length > 0) {
                    const result = transform(selection, tabSize);
                    const processed = processResult(result);
                    value = processed.value;
                    error = processed.error;
                } else {
                    const docText = getDocumentText();
                    const result = transform(docText, tabSize);
                    const processed = processResult(result);
                    value = processed.value;
                    error = processed.error;
                }

                if (error) {
                    vscode.window.showWarningMessage(`Pancho: ${error}`);
                }
                replaceSelection(value);
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