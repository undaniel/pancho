import * as vscode from 'vscode';

export interface TextEdit {
    range: vscode.Range;
    text: string;
}

export function getEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
}

export function getSelections(editor?: vscode.TextEditor): readonly vscode.Selection[] {
    const ed = editor ?? getEditor();
    return ed ? ed.selections : [];
}

export function getSelection(): string | undefined {
    const editor = getEditor();
    if (!editor) return undefined;
    return editor.document.getText(editor.selection);
}

export function getDocumentText(editor?: vscode.TextEditor): string {
    const ed = editor ?? getEditor();
    return ed ? ed.document.getText() : '';
}

export function getTabSize(): number {
    const editor = getEditor();
    return (editor?.options.tabSize as number) ?? 4;
}

export function getDocumentRange(document: vscode.TextDocument): vscode.Range {
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    return new vscode.Range(firstLine.range.start, lastLine.range.end);
}

export function getMaxFileSizeBytes(): number {
    const config = vscode.workspace.getConfiguration('pancho');
    return config.get<number>('maxFileSizeKB', 5120) * 1024;
}

export function isFileWithinLimit(text: string): boolean {
    const max = getMaxFileSizeBytes();
    if (max <= 0) return true;
    return byteLength(text) <= max;
}

export function formatFileTooLargeMessage(text: string): string {
    const max = getMaxFileSizeBytes();
    return vscode.l10n.t(
        'Pancho: File too large ({0}KB). Max: {1}KB',
        Math.round(byteLength(text) / 1024),
        Math.round(max / 1024)
    );
}

function byteLength(text: string): number {
    return Buffer.byteLength(text, 'utf8');
}

export async function applyEdits(editor: vscode.TextEditor, edits: TextEdit[]): Promise<boolean> {
    if (edits.length === 0) return true;
    const sorted = [...edits].sort((a, b) => comparePositionsDesc(a.range.start, b.range.start));
    return editor.edit(editBuilder => {
        for (const edit of sorted) {
            editBuilder.replace(edit.range, edit.text);
        }
    });
}

function comparePositionsDesc(a: vscode.Position, b: vscode.Position): number {
    if (a.line !== b.line) return b.line - a.line;
    return b.character - a.character;
}

export async function replaceSelection(replacement: string): Promise<boolean> {
    const editor = getEditor();
    if (!editor) return false;
    return editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, replacement);
    });
}

export async function replaceDocumentText(replacement: (text: string) => string): Promise<boolean> {
    const editor = getEditor();
    if (!editor) return false;
    const fullText = editor.document.getText();
    const newText = replacement(fullText);
    return editor.edit(editBuilder => {
        editBuilder.replace(getDocumentRange(editor.document), newText);
    });
}

export async function insertAtCursor(text: string): Promise<boolean> {
    const editor = getEditor();
    if (!editor) return false;
    const position = editor.selection.active;
    return editor.edit(editBuilder => {
        editBuilder.insert(position, text);
    });
}

export async function insertAtCursors(text: string): Promise<boolean> {
    const editor = getEditor();
    if (!editor) return false;
    const positions = editor.selections.map(selection => selection.active);
    if (positions.length === 0) return false;
    return editor.edit(editBuilder => {
        for (const position of positions) {
            editBuilder.insert(position, text);
        }
    });
}
