import * as vscode from 'vscode';

const log = (...args: any[]) => console.log('[Pancho]', ...args);

export function getEditor(): vscode.TextEditor | undefined {
    const editor = vscode.window.activeTextEditor;
    log('getEditor:', editor ? 'found' : 'undefined');
    return editor;
}

export function getSelection(): string | undefined {
    const editor = getEditor();
    if (!editor) return undefined;
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    log('getSelection:', text ? `"${text.substring(0, 20)}..."` : 'empty');
    return text;
}

export function replaceSelection(replacement: string): void {
    const editor = getEditor();
    if (!editor) {
        log('replaceSelection: no editor');
        return;
    }
    const selection = editor.selection;
    log('replaceSelection: replacing selection with', replacement.substring(0, 30));
    editor.edit(editBuilder => {
        editBuilder.replace(selection, replacement);
    });
    log('replaceSelection: done');
}

export function replaceDocumentText(replacement: (text: string) => string): void {
    const editor = getEditor();
    if (!editor) {
        log('replaceDocumentText: no editor');
        return;
    }
    const fullText = editor.document.getText();
    const newText = replacement(fullText);
    log('replaceDocumentText: new text length', newText.length);
    const firstLine = editor.document.lineAt(0);
    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const fullRange = new vscode.Range(
        firstLine.range.start,
        lastLine.range.end
    );
    editor.edit(editBuilder => {
        editBuilder.replace(fullRange, newText);
    });
    log('replaceDocumentText: done');
}

export function insertAtCursor(text: string): void {
    const editor = getEditor();
    if (!editor) return;
    const position = editor.selection.active;
    editor.edit(editBuilder => {
        editBuilder.insert(position, text);
    });
}

export function getTabSize(): number {
    const editor = getEditor();
    return (editor?.options.tabSize as number) ?? 4;
}