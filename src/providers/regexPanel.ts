import * as vscode from 'vscode';
import { Commands } from '../commands/registry';
import { runRegexJob } from '../utils/safeRegex';
import { getRegexTimeoutMs } from '../utils/config';
import { t } from '../utils/i18n';
import { registerCommand } from '../utils/register';
import { isFileWithinLimit, formatFileTooLargeMessage } from '../utils/editor';
import { confirmWithPreview, isPreviewEnabled } from '../utils/preview';

const MAX_SAMPLE_LENGTH = 200_000;
const HISTORY_KEY = 'pancho.regexHistory';
const SAVED_KEY = 'pancho.regexSaved';
const MAX_HISTORY = 20;
const MEDIA_DIR = 'media';

interface SavedPattern {
    name: string;
    pattern: string;
    flags: string;
}

let currentPanel: vscode.WebviewPanel | undefined;

function nonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let value = '';
    for (let i = 0; i < 32; i++) value += chars.charAt(Math.floor(Math.random() * chars.length));
    return value;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeFlags(flags: string): string {
    const allowed = 'gimsuy';
    let out = '';
    for (const char of flags) {
        if (allowed.includes(char) && !out.includes(char)) out += char;
    }
    if (!out.includes('g')) out += 'g';
    return out;
}

interface PanelBoot {
    sample: string;
    history: string[];
    saved: SavedPattern[];
}

/** Serializes data for an inline `<script>`, neutralising any `</script>` break-out. */
function toInlineJson(value: unknown): string {
    return JSON.stringify(value).replace(/</g, '\\u003c').replace(/<\/script/gi, '<\\/script');
}

let cachedTemplate: Promise<string> | undefined;

async function readAsset(context: vscode.ExtensionContext, name: string): Promise<Uint8Array> {
    return vscode.workspace.fs.readFile(vscode.Uri.joinPath(context.extensionUri, MEDIA_DIR, name));
}

/** Reads and caches the webview template. Uses the VS Code FS so the web host works too. */
function loadTemplate(context: vscode.ExtensionContext): Promise<string> {
    if (!cachedTemplate) {
        cachedTemplate = (async () => {
            try {
                return new TextDecoder().decode(await readAsset(context, 'regexPanel.html'));
            } catch {
                return '';
            }
        })();
    }
    return cachedTemplate;
}

async function buildHtml(
    context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel,
    boot: PanelBoot
): Promise<string> {
    const template = await loadTemplate(context);
    const webview = panel.webview;
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, MEDIA_DIR, 'regexPanel.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, MEDIA_DIR, 'regexPanel.css'));
    const n = nonce();

    const labels: Record<string, string> = {
        pattern: t('Regex pattern'),
        flags: t('Flags'),
        testText: t('Test text'),
        replaceWith: t('Replace with'),
        preview: t('Preview'),
        apply: t('Apply to document'),
        history: t('History'),
        saved: t('Saved'),
        save: t('Save'),
        name: t('Name'),
        delete: t('Delete'),
        copy: t('Copy'),
        previous: t('Previous match'),
        next: t('Next match'),
    };
    const values: Record<string, string> = {
        lang: escapeHtml(vscode.env.language || 'en'),
        csp: `default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${n}';`,
        nonce: n,
        styleUri: styleUri.toString(),
        scriptUri: scriptUri.toString(),
        bootJson: toInlineJson(boot),
        uiJson: toInlineJson({
            matches: t('{0} match(es)'),
            replaced: t('{0} replaced'),
            copied: t('Copied to the clipboard'),
        }),
    };
    for (const [key, value] of Object.entries(labels)) values[`label.${key}`] = escapeHtml(value);

    return template.replace(/\{\{([\w.]+)\}\}/g, (match, key: string) => values[key] ?? match);
}

function sampleText(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return '';
    const selected = editor.document.getText(editor.selection);
    const text = selected.length > 0 ? selected : editor.document.getText();
    return text.length > MAX_SAMPLE_LENGTH ? text.slice(0, MAX_SAMPLE_LENGTH) : text;
}

function readSaved(context: vscode.ExtensionContext): SavedPattern[] {
    return context.globalState.get<SavedPattern[]>(SAVED_KEY, []);
}

async function recordHistory(context: vscode.ExtensionContext, pattern: string): Promise<string[] | undefined> {
    if (!pattern) return undefined;
    const history = context.globalState.get<string[]>(HISTORY_KEY, []);
    if (history[0] === pattern) return undefined;
    const next = [pattern, ...history.filter(p => p !== pattern)].slice(0, MAX_HISTORY);
    await context.globalState.update(HISTORY_KEY, next);
    return next;
}

export function registerRegexPanel(context: vscode.ExtensionContext): void {
    registerCommand(context, Commands.REGEX_TESTER_PANEL, async () => {
        const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;
        if (currentPanel) {
            currentPanel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(
            'panchoRegexTester',
            t('Pancho: Regex tester'),
            column,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, MEDIA_DIR)],
            }
        );
        currentPanel = panel;
        panel.webview.html = await buildHtml(context, panel, {
            sample: sampleText(),
            history: context.globalState.get<string[]>(HISTORY_KEY, []),
            saved: readSaved(context),
        });

        let testAbort: AbortController | undefined;
        let replaceAbort: AbortController | undefined;

        panel.webview.onDidReceiveMessage(async (message: {
            type: string; pattern: string; flags: string; text: string; replacement?: string; name?: string;
        }) => {
            const timeout = getRegexTimeoutMs();
            if (message.type === 'test') {
                testAbort?.abort();
                const controller = new AbortController();
                testAbort = controller;
                const history = await recordHistory(context, message.pattern);
                if (history) await panel.webview.postMessage({ type: 'history', history });
                const result = await runRegexJob(
                    { pattern: message.pattern, flags: normalizeFlags(message.flags), text: message.text, mode: 'exec', maxMatches: 10000 },
                    { timeoutMs: timeout, signal: controller.signal }
                );
                if (result.error === 'cancelled') return;
                await panel.webview.postMessage({ type: 'result', matches: result.matches ?? [], error: result.error });
            } else if (message.type === 'replace') {
                replaceAbort?.abort();
                const controller = new AbortController();
                replaceAbort = controller;
                const result = await runRegexJob(
                    { pattern: message.pattern, flags: normalizeFlags(message.flags), text: message.text, mode: 'replace', replacement: message.replacement ?? '' },
                    { timeoutMs: timeout, signal: controller.signal }
                );
                if (result.error === 'cancelled') return;
                await panel.webview.postMessage({ type: 'replaceResult', result: result.result ?? message.text, count: result.count ?? 0, error: result.error });
            } else if (message.type === 'apply') {
                await applyReplacement(message.pattern, message.flags, message.replacement ?? '');
            } else if (message.type === 'copy') {
                await vscode.env.clipboard.writeText(message.text);
                await panel.webview.postMessage({ type: 'copied' });
            } else if (message.type === 'save') {
                const saved = readSaved(context).filter(item => item.name !== message.name);
                saved.push({ name: message.name ?? message.pattern, pattern: message.pattern, flags: normalizeFlags(message.flags) });
                await context.globalState.update(SAVED_KEY, saved);
                await panel.webview.postMessage({ type: 'saved', saved });
            } else if (message.type === 'deleteSaved') {
                const saved = readSaved(context).filter(item => item.name !== message.name);
                await context.globalState.update(SAVED_KEY, saved);
                await panel.webview.postMessage({ type: 'saved', saved });
            }
        });

        panel.onDidDispose(() => {
            testAbort?.abort();
            replaceAbort?.abort();
            if (currentPanel === panel) currentPanel = undefined;
        }, null, context.subscriptions);
    });
}

async function applyReplacement(pattern: string, flags: string, replacement: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage(t('Pancho: No active editor'));
        return;
    }
    const selectionText = editor.document.getText(editor.selection);
    const isSelection = selectionText.length > 0;
    const wholeText = isSelection ? undefined : editor.document.getText();
    if (wholeText !== undefined && !isFileWithinLimit(wholeText)) {
        vscode.window.showWarningMessage(formatFileTooLargeMessage(wholeText));
        return;
    }
    const source = isSelection ? selectionText : wholeText!;
    const result = await runRegexJob(
        { pattern, flags: normalizeFlags(flags), text: source, mode: 'replace', replacement },
        { timeoutMs: getRegexTimeoutMs() }
    );
    if (result.error || result.result === undefined) {
        vscode.window.showWarningMessage(t('Pancho: {0}', t('Invalid pattern')));
        return;
    }
    const newText = result.result;
    if (isPreviewEnabled() && !(await confirmWithPreview(source, newText, t('Regex replace')))) return;
    await editor.edit(builder => {
        if (isSelection) {
            builder.replace(editor.selection, newText);
        } else {
            const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            builder.replace(new vscode.Range(editor.document.lineAt(0).range.start, lastLine.range.end), newText);
        }
    });
}
