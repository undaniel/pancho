import * as assert from 'assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'undaniels.pancho-plus-plus';
const FIXTURE = 'hello\nworld\nalpha\nbeta\n';

suite('Pancho Integration Tests', function () {
    this.timeout(30000);

    let document: vscode.TextDocument;
    let editor: vscode.TextEditor;

    suiteSetup(async function () {
        const extension = vscode.extensions.getExtension(EXTENSION_ID);
        assert.ok(extension, `expected ${EXTENSION_ID} to be installed`);
        await extension!.activate();

        // Destructive commands open a diff preview by default, which would open
        // another editor and block the test. Turn it off for the test run.
        const config = vscode.workspace.getConfiguration('pancho');
        await config.update('previewDestructive', false, vscode.ConfigurationTarget.Global);
        await config.update('previewAllChanges', false, vscode.ConfigurationTarget.Global);

        // A single untitled document keeps the tests hermetic (no workspace files
        // are touched) and its editor stays active between tests.
        document = await vscode.workspace.openTextDocument({ content: FIXTURE, language: 'plaintext' });
        editor = await vscode.window.showTextDocument(document);
    });

    suiteTeardown(async function () {
        const config = vscode.workspace.getConfiguration('pancho');
        await config.update('previewDestructive', undefined, vscode.ConfigurationTarget.Global);
        await config.update('previewAllChanges', undefined, vscode.ConfigurationTarget.Global);
    });

    setup(async function () {
        // Make sure our editor is the active one: the commands resolve
        // `window.activeTextEditor`, and the test host can briefly focus others.
        editor = await vscode.window.showTextDocument(document, { preview: false, preserveFocus: false });
        for (let i = 0; i < 25 && vscode.window.activeTextEditor !== editor; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        await setContent(FIXTURE);
        const start = new vscode.Position(0, 0);
        editor.selection = new vscode.Selection(start, start);
    });

    async function setContent(text: string): Promise<void> {
        const full = new vscode.Range(0, 0, document.lineCount, 0);
        const applied = await editor.edit(builder => builder.replace(full, text));
        assert.ok(applied, 'failed to replace the document content');
    }

    function select(start: vscode.Position, end: vscode.Position): void {
        editor.selection = new vscode.Selection(start, end);
    }

    test('activates the extension and registers its commands', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('pancho.showMenu'), 'pancho.showMenu should be registered');
        assert.ok(commands.includes('pancho.runPipeline'), 'pancho.runPipeline should be registered');
    });

    test('toUpperCase transforms the selection', async () => {
        select(new vscode.Position(0, 0), new vscode.Position(0, 5));
        await vscode.commands.executeCommand('pancho.toUpperCase');
        assert.strictEqual(document.getText(new vscode.Range(0, 0, 0, 5)), 'HELLO');
    });

    test('base64Encode transforms the selection', async () => {
        await setContent('hello');
        select(new vscode.Position(0, 0), new vscode.Position(0, 5));
        await vscode.commands.executeCommand('pancho.base64Encode');
        assert.strictEqual(document.getText(), 'aGVsbG8=');
    });

    test('hashMD5 transforms the selection', async () => {
        await setContent('hello');
        select(new vscode.Position(0, 0), new vscode.Position(0, 5));
        await vscode.commands.executeCommand('pancho.hashMD5');
        assert.strictEqual(document.getText(), '5d41402abc4b2a76b9719d911017c592');
    });

    test('removeDuplicateLines leaves unique lines', async () => {
        await setContent('apple\nbanana\napple\ncherry');
        await vscode.commands.executeCommand('pancho.removeDuplicateLines');
        const lines = document.getText().split('\n').filter(Boolean);
        assert.strictEqual(lines.length, new Set(lines).size);
        assert.ok(lines.includes('apple') && lines.includes('banana') && lines.includes('cherry'));
    });

    test('sortNatural sorts numerically aware', async () => {
        await setContent('b10\nb2\nb1');
        await vscode.commands.executeCommand('pancho.sortNatural');
        assert.strictEqual(document.getText().trim(), 'b1\nb2\nb10');
    });

    test('reverseLines reverses the line order', async () => {
        await setContent('a\nb\nc');
        await vscode.commands.executeCommand('pancho.reverseLines');
        assert.strictEqual(document.getText().trim(), 'c\nb\na');
    });

    test('generateUUID inserts a UUID at the cursor', async () => {
        await setContent('');
        await vscode.commands.executeCommand('pancho.generateUUID');
        assert.match(document.getText(), /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
});
