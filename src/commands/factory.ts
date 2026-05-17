import * as vscode from 'vscode';
import { CommandName } from './registry';
import { getSelection, replaceSelection, replaceDocumentText, insertAtCursor, getTabSize, getDocumentText } from '../utils/editor';

export type TransformFn = (text: string, tabSize: number) => string;
export type InsertFn = () => string;
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

export function registerTextCommand(context: vscode.ExtensionContext, options: TextCommandOptions): void {
    const { command, transform } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, () => {
            try {
                const tabSize = getTabSize();
                const selection = getText();
                if (selection !== undefined && selection.length > 0) {
                    replaceSelection(transform(selection, tabSize));
                } else {
                    replaceDocumentText(text => transform(text, tabSize));
                }
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(String(err));
            }
        })
    );
}

export function registerInsertCommand(context: vscode.ExtensionContext, options: InsertCommandOptions): void {
    const { command, insert } = options;
    context.subscriptions.push(
        vscode.commands.registerCommand(command, () => {
            try {
                insertAtCursor(insert());
            } catch (err) {
                console.error('[Pancho] Error:', err);
                vscode.window.showErrorMessage(String(err));
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
                vscode.window.showErrorMessage(String(err));
            }
        })
    );
}