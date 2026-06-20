import * as vscode from 'vscode';

export function getEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
}

export function getSelection(): string | undefined {
    const editor = getEditor();
    if (!editor) return undefined;
    return editor.document.getText(editor.selection);
}

export function replaceSelection(replacement: string): void {
    const editor = getEditor();
    if (!editor) return;
    editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, replacement);
    });
}

export function replaceDocumentText(replacement: (text: string) => string): void {
    const editor = getEditor();
    if (!editor) return;
    const fullText = editor.document.getText();
    const newText = replacement(fullText);
    const firstLine = editor.document.lineAt(0);
    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const fullRange = new vscode.Range(
        firstLine.range.start,
        lastLine.range.end
    );
    editor.edit(editBuilder => {
        editBuilder.replace(fullRange, newText);
    });
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

export function getDocumentText(): string {
    const editor = getEditor();
    return editor?.document.getText() ?? '';
}