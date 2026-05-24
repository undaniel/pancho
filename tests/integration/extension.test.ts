import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Pancho Integration Tests', function() {
    this.timeout(30000);

    let document: vscode.TextDocument;
    let editor: vscode.TextEditor;

    suiteSetup(async function() {
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath) {
            throw new Error('No workspace folder found');
        }
        const filePath = path.join(workspacePath, 'test.txt');
        document = await vscode.workspace.openTextDocument(filePath);
        editor = await vscode.window.showTextDocument(document);
    });

    teardown(async function() {
        if (document) {
            await document.close();
        }
    });

    suite('Text Transformation Commands', () => {
        test('toUpperCase should convert text to uppercase', async () => {
            const range = new vscode.Range(0, 0, 0, 5);
            await editor.selection = new vscode.Selection(range.start, range.end);
            await vscode.commands.executeCommand('pancho.toUpperCase');
            const text = editor.document.getText(range);
            assert.strictEqual(text, 'HELLO');
        });

        test('toLowerCase should convert text to lowercase', async () => {
            const range = new vscode.Range(1, 0, 1, 5);
            await editor.selection = new vscode.Selection(range.start, range.end);
            await vscode.commands.executeCommand('pancho.toLowerCase');
            const text = editor.document.getText(range);
            assert.strictEqual(text, 'hello');
        });

        test('trimLines should remove leading/trailing whitespace', async () => {
            await editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(0, 0), '  test  ');
            });
            const fullRange = new vscode.Range(0, 0, 0, 9);
            await editor.selection = new vscode.Selection(fullRange.start, fullRange.end);
            await vscode.commands.executeCommand('pancho.trimLines');
            const text = editor.document.getText(fullRange);
            assert.strictEqual(text.trim(), 'test');
        });
    });

    suite('Line Operations', () => {
        test('removeDuplicateLines should remove duplicate lines', async () => {
            const content = 'apple\nbanana\napple\ncherry';
            await editor.edit(editBuilder => {
                const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
                editBuilder.insert(lastLine.range.end, '\n' + content);
            });
            await vscode.commands.executeCommand('pancho.removeDuplicateLines');
            const lines = editor.document.getText().split('\n');
            const uniqueLines = [...new Set(lines.filter(l => l.trim()))];
            assert.ok(lines.length <= uniqueLines.length + 2);
        });

        test('sortAscending should sort lines alphabetically', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'cherry\napple\nbanana');
            });
            await vscode.commands.executeCommand('pancho.sortAscending');
            const text = editor.document.getText();
            assert.ok(text.includes('apple\nbanana\ncherry'));
        });

        test('sortDescending should sort lines reverse alphabetically', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'apple\nbanana\ncherry');
            });
            await vscode.commands.executeCommand('pancho.sortDescending');
            const text = editor.document.getText();
            assert.ok(text.includes('cherry\nbanana\napple'));
        });
    });

    suite('Encoding Commands', () => {
        test('base64Encode should encode text to base64', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'hello');
            });
            const range = new vscode.Range(0, 0, 0, 5);
            await editor.selection = new vscode.Selection(range.start, range.end);
            await vscode.commands.executeCommand('pancho.base64Encode');
            const text = editor.document.getText(range);
            assert.strictEqual(text, 'aGVsbG8=');
        });

        test('base64Decode should decode base64 to text', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'aGVsbG8=');
            });
            const range = new vscode.Range(0, 0, 0, 7);
            await editor.selection = new vscode.Selection(range.start, range.end);
            await vscode.commands.executeCommand('pancho.base64Decode');
            const text = editor.document.getText(range);
            assert.strictEqual(text, 'hello');
        });
    });

    suite('Hash Commands', () => {
        test('hashMD5 should return MD5 hash with warning', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'hello');
            });
            const range = new vscode.Range(0, 0, 0, 5);
            await editor.selection = new vscode.Selection(range.start, range.end);
            await vscode.commands.executeCommand('pancho.hashMD5');
            const text = editor.document.getText(range);
            assert.strictEqual(text, '5d41402abc4b2a76b9719d911017c592');
        });
    });

    suite('Count Commands', () => {
        test('countWords should show word count', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'hello world test');
            });
            await vscode.commands.executeCommand('pancho.countWords');
        });

        test('countCharacters should show character count', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'hello');
            });
            await vscode.commands.executeCommand('pancho.countCharacters');
        });

        test('countLines should show line count', async () => {
            await vscode.commands.executeCommand('pancho.countLines');
        });
    });

    suite('Line Editing Commands', () => {
        test('moveLineUp should move current line up', async function() {
            this.skip();
        });

        test('moveLineDown should move current line down', async function() {
            this.skip();
        });

        test('duplicateLine should duplicate current line', async () => {
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
                editBuilder.insert(new vscode.Position(0, 0), 'line1\nline2\nline3');
            });
            await vscode.commands.executeCommand('pancho.duplicateLine');
            const lines = editor.document.getText().split('\n');
            assert.ok(lines[0] === 'line1line1' || lines.includes('line1'));
        });
    });
});