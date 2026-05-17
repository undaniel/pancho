import * as vscode from 'vscode';

const log = (...args: any[]) => console.log('[Pancho]', ...args);

function getEditor(): vscode.TextEditor | undefined {
    const editor = vscode.window.activeTextEditor;
    log('getEditor:', editor ? 'found' : 'undefined');
    return editor;
}

function getSelection(): string | undefined {
    const editor = getEditor();
    if (!editor) return undefined;
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    log('getSelection:', text ? `"${text.substring(0, 20)}..."` : 'empty');
    return text;
}

function replaceSelection(replacement: string): void {
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

function replaceDocumentText(replacement: (text: string) => string): void {
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

function cleanWhitespace(text: string): string {
    return text
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^[ \t]+/gm, '')
        .replace(/[ \t]+$/gm, '');
}

function cleanLineEndings(text: string): string {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

function tabsToSpaces(text: string, tabSize: number = 4): string {
    return text.replace(/\t/g, ' '.repeat(tabSize));
}

function spacesToTabs(text: string, tabSize: number = 4): string {
    const lines = text.split('\n');
    return lines.map(line => {
        let result = '';
        for (let i = 0; i < line.length; i++) {
            if (line[i] === ' ') {
                const spacesToNextTab = tabSize - (result.length % tabSize);
                result += '\t';
                i += spacesToNextTab - 1;
            } else {
                result += line[i];
            }
        }
        return result;
    }).join('\n');
}

function toUpper(text: string): string {
    return text.toUpperCase();
}

function toLower(text: string): string {
    return text.toLowerCase();
}

function toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function trimLines(text: string): string {
    return text.split('\n').map(line => line.trim()).join('\n');
}

function lineEndingsToSpaces(text: string): string {
    return text.replace(/\r?\n|\r/g, ' ');
}

function increaseIndent(text: string, tabSize: number = 4): string {
    const indent = ' '.repeat(tabSize);
    return text.split('\n').map(line => indent + line).join('\n');
}

function decreaseIndent(text: string, tabSize: number = 4): string {
    const indent = ' '.repeat(tabSize);
    return text.split('\n').map(line => {
        if (line.startsWith(indent)) {
            return line.substring(tabSize);
        }
        return line;
    }).join('\n');
}

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Pancho extension activated!');
    console.log('[Pancho] Extension activating...');

    const registerCommand = (command: string, handler: () => void) => {
        console.log('[Pancho] Registering command:', command);
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                console.log('[Pancho] Command invoked:', command);
                try {
                    handler();
                } catch (err) {
                    console.error('[Pancho] Error:', err);
                    vscode.window.showErrorMessage(String(err));
                }
            })
        );
    };

    registerCommand('pancho.cleanWhitespace', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(cleanWhitespace(selection));
        } else {
            replaceDocumentText(cleanWhitespace);
        }
    });

    registerCommand('pancho.cleanLineEndings', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(cleanLineEndings(selection));
        } else {
            replaceDocumentText(cleanLineEndings);
        }
    });

    registerCommand('pancho.convertTabsToSpaces', () => {
        const editor = getEditor();
        const tabSize = (editor?.options.tabSize as number) ?? 4;
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(tabsToSpaces(selection, tabSize));
        } else {
            replaceDocumentText(text => tabsToSpaces(text, tabSize));
        }
    });

    registerCommand('pancho.convertSpacesToTabs', () => {
        const editor = getEditor();
        const tabSize = (editor?.options.tabSize as number) ?? 4;
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(spacesToTabs(selection, tabSize));
        } else {
            replaceDocumentText(text => spacesToTabs(text, tabSize));
        }
    });

    registerCommand('pancho.toUpperCase', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(toUpper(selection));
        } else {
            replaceDocumentText(toUpper);
        }
    });

    registerCommand('pancho.toLowerCase', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(toLower(selection));
        } else {
            replaceDocumentText(toLower);
        }
    });

    registerCommand('pancho.toTitleCase', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(toTitleCase(selection));
        } else {
            replaceDocumentText(toTitleCase);
        }
    });

    registerCommand('pancho.trimLines', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(trimLines(selection));
        } else {
            replaceDocumentText(trimLines);
        }
    });

    registerCommand('pancho.lineEndingsToSpaces', () => {
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(lineEndingsToSpaces(selection));
        } else {
            replaceDocumentText(lineEndingsToSpaces);
        }
    });

    registerCommand('pancho.increaseIndent', () => {
        const editor = getEditor();
        const tabSize = (editor?.options.tabSize as number) ?? 4;
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(increaseIndent(selection, tabSize));
        } else {
            replaceDocumentText(text => increaseIndent(text, tabSize));
        }
    });

    registerCommand('pancho.decreaseIndent', () => {
        const editor = getEditor();
        const tabSize = (editor?.options.tabSize as number) ?? 4;
        const selection = getSelection();
        if (selection !== undefined && selection.length > 0) {
            replaceSelection(decreaseIndent(selection, tabSize));
        } else {
            replaceDocumentText(text => decreaseIndent(text, tabSize));
        }
    });
}

export function deactivate() {}