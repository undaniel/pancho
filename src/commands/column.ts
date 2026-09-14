import * as vscode from 'vscode';
import { Commands } from './registry';
import { detectColumnBlock, insertAtColumns, deleteColumns, copyColumns, pasteColumns, SelectionLike } from '../core/columnBlock';
import { replaceDocumentText } from '../utils/editor';

function selectionLikes(editor: vscode.TextEditor): SelectionLike[] {
    return editor.selections.map(selection => ({
        startLine: selection.start.line,
        startChar: selection.start.character,
        endLine: selection.end.line,
        endChar: selection.end.character,
    }));
}

export function registerColumnCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.COLUMN_INSERT, async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                return;
            }
            const block = detectColumnBlock(selectionLikes(editor));
            if (!block) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Select a column block (Alt+drag)'));
                return;
            }
            const value = await vscode.window.showInputBox({ prompt: vscode.l10n.t('Text to insert') });
            if (value === undefined) return;
            await replaceDocumentText(text => insertAtColumns(text, block, value));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.COLUMN_DELETE, async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                return;
            }
            const block = detectColumnBlock(selectionLikes(editor));
            if (!block) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Select a column block (Alt+drag)'));
                return;
            }
            await replaceDocumentText(text => deleteColumns(text, block));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.COLUMN_COPY, async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                return;
            }
            const block = detectColumnBlock(selectionLikes(editor));
            if (!block) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Select a column block (Alt+drag)'));
                return;
            }
            await vscode.env.clipboard.writeText(copyColumns(editor.document.getText(), block));
            vscode.window.showInformationMessage(vscode.l10n.t('Pancho: Column copied to clipboard'));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.COLUMN_PASTE, async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                return;
            }
            const block = detectColumnBlock(selectionLikes(editor));
            if (!block) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Select a column block (Alt+drag)'));
                return;
            }
            const content = await vscode.env.clipboard.readText();
            await replaceDocumentText(text => pasteColumns(text, block, content));
        })
    );
}
