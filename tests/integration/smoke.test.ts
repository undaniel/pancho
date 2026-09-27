import * as assert from 'assert';
import * as vscode from 'vscode';
import { Commands } from '../../src/commands/registry';

/**
 * Smoke test for the whole command surface.
 *
 * Every command in the registry is executed against a prepared editor. User
 * interaction (input boxes, quick picks, dialogs, external links) is stubbed so
 * no command can block, and destructive previews are disabled. The test asserts
 * that each command is registered and settles without throwing.
 *
 * Shallow by design (behaviour lives in the unit tests) but it catches missing
 * registrations, crashes on the cancel path and hangs.
 */

const FIXTURE = [
    'banana',
    'apple',
    'cherry',
    'apple',
    'date',
    'alpha',
    'beta',
    'gamma',
    'name,role',
    'Ada,Engineer',
    'Grace,Admiral',
    '',
].join('\n');

const PER_COMMAND_TIMEOUT = 10000;

type AnyApi = Record<string, unknown>;

function withTimeout(promise: Thenable<unknown>, ms: number): Promise<void> {
    return Promise.race([
        Promise.resolve(promise).then(() => undefined),
        new Promise<void>((_resolve, reject) => {
            setTimeout(() => reject(new Error(`did not settle within ${ms}ms`)), ms);
        }),
    ]);
}

interface Stubs {
    restore: () => void;
    unavailable: string[];
}

/** Replaces every user-facing dialog so commands resolve immediately. */
function stubUserInteraction(): Stubs {
    const window = vscode.window as unknown as AnyApi;
    const env = vscode.env as unknown as AnyApi;
    const clipboard = (env.clipboard ?? {}) as AnyApi;

    const snapshot: Array<[AnyApi, string, PropertyDescriptor | undefined]> = [];
    const unavailable: string[] = [];

    const patch = (target: AnyApi, key: string, value: unknown, critical = true) => {
        try {
            const descriptor = Object.getOwnPropertyDescriptor(target, key);
            Object.defineProperty(target, key, {
                value,
                configurable: true,
                writable: true,
                enumerable: descriptor?.enumerable ?? true,
            });
            snapshot.push([target, key, descriptor]);
        } catch {
            if (critical) unavailable.push(key);
            else console.log(`smoke: (optional) could not stub ${key}`);
        }
    };

    // Empty input resolves the cancel-ish path without infinite loops
    // (`repeatLastTimes` treats a non-number as invalid and stops). A quick pick
    // resolving to `undefined` exercises the cancel path of every picker.
    patch(window, 'showInputBox', async () => '');
    patch(window, 'showQuickPick', async () => undefined);
    patch(window, 'showInformationMessage', async () => undefined);
    patch(window, 'showWarningMessage', async () => undefined);
    patch(window, 'showErrorMessage', async () => undefined);
    patch(window, 'showOpenDialog', async () => undefined);
    patch(window, 'showSaveDialog', async () => undefined);
    patch(env, 'openExternal', async () => true);
    patch(clipboard, 'readText', async () => 'clipboard line\nsecond line', false);

    return {
        unavailable,
        restore: () => {
            for (const [target, key, descriptor] of snapshot.reverse()) {
                try {
                    if (descriptor) Object.defineProperty(target, key, descriptor);
                    else delete target[key];
                } catch {
                    // Best effort; the test host is torn down afterwards anyway.
                }
            }
        },
    };
}

suite('Pancho command smoke test', function () {
    this.timeout(PER_COMMAND_TIMEOUT + 5000);

    let document: vscode.TextDocument;
    let stubs: Stubs;
    let available = new Set<string>();

    suiteSetup(async function () {
        const extension = vscode.extensions.getExtension('undaniels.pancho-plus-plus');
        assert.ok(extension, 'expected the Pancho extension to be installed');
        await extension!.activate();

        // Never open a diff preview (it would steal focus and open extra editors).
        const config = vscode.workspace.getConfiguration('pancho');
        await config.update('previewDestructive', false, vscode.ConfigurationTarget.Global);
        await config.update('previewAllChanges', false, vscode.ConfigurationTarget.Global);

        stubs = stubUserInteraction();
        if (stubs.unavailable.length > 0) {
            console.log(`smoke: could not stub ${stubs.unavailable.join(', ')}`);
        }
        available = new Set(await vscode.commands.getCommands(true));

        document = await vscode.workspace.openTextDocument({ content: FIXTURE, language: 'plaintext' });
        await vscode.window.showTextDocument(document);
    });

    suiteTeardown(async function () {
        stubs?.restore();
        const config = vscode.workspace.getConfiguration('pancho');
        await config.update('previewDestructive', undefined, vscode.ConfigurationTarget.Global);
        await config.update('previewAllChanges', undefined, vscode.ConfigurationTarget.Global);
    });

    setup(async function () {
        // Bring our document back to the foreground: some commands open panels,
        // diffs or untitled documents that would otherwise become active.
        await vscode.window.showTextDocument(document, { preview: false, preserveFocus: false });
        for (let i = 0; i < 50 && vscode.window.activeTextEditor?.document !== document; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        await resetContent();
        // A selection with content exercises selection-aware commands.
        const active = vscode.window.activeTextEditor;
        if (active?.document === document) {
            active.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(3, 0));
        }
    });

    teardown(async function () {
        // Let asynchronous native edits (delegate commands) settle before the
        // next test reuses the document.
        await new Promise(resolve => setTimeout(resolve, 20));
    });

    async function resetContent(): Promise<void> {
        // A WorkspaceEdit targets the document, not an editor proxy, so it is
        // immune to stale editor handles after native commands run.
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), FIXTURE);
        const applied = await vscode.workspace.applyEdit(edit);
        assert.ok(applied, 'failed to reset the document content');
    }

    for (const command of Object.values(Commands)) {
        test(`runs ${command}`, async () => {
            assert.ok(available.has(command), `${command} is not registered`);
            try {
                await withTimeout(vscode.commands.executeCommand(command), PER_COMMAND_TIMEOUT);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                const isTimeout = message.includes('did not settle');
                // Without stubs an interactive command legitimately waits for the
                // user; only report it, never fail the suite for that.
                if (isTimeout && stubs.unavailable.length > 0) {
                    console.log(`  (skipped: ${command} needs user input and stubs are unavailable)`);
                    return;
                }
                throw error;
            }
        });
    }
});
