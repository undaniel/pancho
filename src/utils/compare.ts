import * as vscode from 'vscode';
import { t } from './i18n';
import { formatFileTooLargeMessage, isFileWithinLimit } from './editor';

function displayName(uri: vscode.Uri): string {
    const path = uri.path;
    const index = path.lastIndexOf('/');
    return index >= 0 ? path.slice(index + 1) : path;
}

/**
 * Opens a diff between the clipboard and the current selection (or the whole
 * document) using two writable scratch documents. Both panes can be edited, so
 * pasting new text on either side updates the differences live — like a text
 * compare tool, without leaving VS Code or writing to disk.
 */
export async function compareWithClipboard(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        void vscode.window.showWarningMessage(t('Pancho: Open a file to compare.'));
        return;
    }

    const text = editor.selection.isEmpty
        ? editor.document.getText()
        : editor.document.getText(editor.selection);
    if (!isFileWithinLimit(text)) {
        void vscode.window.showWarningMessage(formatFileTooLargeMessage(text));
        return;
    }

    const clipboard = await vscode.env.clipboard.readText();
    const language = editor.document.languageId;
    const [left, right] = await Promise.all([
        vscode.workspace.openTextDocument({ content: clipboard, language }),
        vscode.workspace.openTextDocument({ content: text, language }),
    ]);

    const name = editor.document.isUntitled ? t('Untitled') : displayName(editor.document.uri);
    await vscode.commands.executeCommand(
        'vscode.diff',
        left.uri,
        right.uri,
        t('Pancho: Compare - Clipboard ↔ {0}', name)
    );
}
