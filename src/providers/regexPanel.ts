import * as vscode from 'vscode';
import { Commands } from '../commands/registry';
import { runRegexJob } from '../utils/safeRegex';
import { getRegexTimeoutMs } from '../utils/config';
import { t } from '../utils/i18n';

const MAX_SAMPLE_LENGTH = 200_000;
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
        .replace(/"/g, '&quot;');
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

function html(sample: string): string {
    const n = nonce();
    const csp = `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${n}';`;
    const labels = {
        pattern: t('Regex pattern'),
        flags: t('Flags'),
        testText: t('Test text'),
        replaceWith: t('Replace with'),
        preview: t('Preview'),
        apply: t('Apply to document'),
    };
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="${csp}" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 10px; }
  label { display: block; margin: 8px 0 2px; font-weight: 600; }
  input[type=text], textarea { width: 100%; box-sizing: border-box; background: var(--vscode-input-background);
    color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, transparent); padding: 4px; }
  textarea { min-height: 120px; font-family: var(--vscode-editor-font-family); }
  .row { display: flex; gap: 8px; }
  .row > * { flex: 1; }
  button { margin-top: 8px; background: var(--vscode-button-background); color: var(--vscode-button-foreground);
    border: none; padding: 5px 12px; cursor: pointer; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  #result { margin-top: 10px; white-space: pre-wrap; font-family: var(--vscode-editor-font-family); }
  #highlights { margin-top: 8px; padding: 6px; border: 1px solid var(--vscode-panel-border); max-height: 220px; overflow: auto;
    white-space: pre-wrap; font-family: var(--vscode-editor-font-family); }
  mark { background: var(--vscode-editor-findMatchHighlightBackground); color: inherit; }
  .error { color: var(--vscode-errorForeground); }
  .muted { opacity: 0.7; }
</style>
</head>
<body>
  <label>${escapeHtml(labels.pattern)}</label>
  <div class="row">
    <input id="pattern" type="text" value="" placeholder="\\d+" />
    <input id="flags" type="text" value="g" style="max-width: 90px" />
  </div>
  <label>${escapeHtml(labels.testText)}</label>
  <textarea id="text" spellcheck="false"></textarea>
  <div id="result" class="muted"></div>
  <div id="highlights"></div>
  <label>${escapeHtml(labels.replaceWith)}</label>
  <input id="replacement" type="text" value="" />
  <button id="preview">${escapeHtml(labels.preview)}</button>
  <button id="apply">${escapeHtml(labels.apply)}</button>
<script nonce="${n}">
  const vscode = acquireVsCodeApi();
  const $ = id => document.getElementById(id);
  const initial = ${JSON.stringify(sample).replace(/</g, '\\u003c')};
  $('text').value = initial;
  let timer;
  function sendTest() {
    vscode.postMessage({ type: 'test', pattern: $('pattern').value, flags: $('flags').value, text: $('text').value });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(sendTest, 200); }
  ['pattern', 'flags', 'text'].forEach(id => $(id).addEventListener('input', schedule));
  $('preview').addEventListener('click', () => {
    vscode.postMessage({ type: 'replace', pattern: $('pattern').value, flags: $('flags').value,
      text: $('text').value, replacement: $('replacement').value });
  });
  $('apply').addEventListener('click', () => {
    vscode.postMessage({ type: 'apply', pattern: $('pattern').value, flags: $('flags').value,
      replacement: $('replacement').value });
  });
  window.addEventListener('message', event => {
    const message = event.data;
    if (message.type === 'result') {
      const result = $('result');
      const highlights = $('highlights');
      highlights.innerHTML = '';
      if (message.error) { result.className = 'error'; result.textContent = message.error; return; }
      const matches = message.matches || [];
      result.className = 'muted';
      result.textContent = matches.length + ' match(es)';
      let last = 0;
      const source = $('text').value;
      for (const match of matches) {
        highlights.appendChild(document.createTextNode(source.slice(last, match.index)));
        const mark = document.createElement('mark');
        mark.textContent = match.match;
        highlights.appendChild(mark);
        last = match.index + match.match.length;
      }
      highlights.appendChild(document.createTextNode(source.slice(last)));
    } else if (message.type === 'replaceResult') {
      const result = $('result');
      result.className = message.error ? 'error' : 'muted';
      result.textContent = message.error ? message.error : (message.count + ' replaced');
      $('text').value = message.result;
    }
  });
  sendTest();
</script>
</body>
</html>`;
}

function sampleText(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return '';
    const selected = editor.document.getText(editor.selection);
    const text = selected.length > 0 ? selected : editor.document.getText();
    return text.length > MAX_SAMPLE_LENGTH ? text.slice(0, MAX_SAMPLE_LENGTH) : text;
}

export function registerRegexPanel(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.REGEX_TESTER_PANEL, () => {
            const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;
            if (currentPanel) {
                currentPanel.reveal(column);
                return;
            }
            const panel = vscode.window.createWebviewPanel(
                'panchoRegexTester',
                t('Pancho: Regex tester'),
                column,
                { enableScripts: true, retainContextWhenHidden: true }
            );
            currentPanel = panel;
            panel.webview.html = html(sampleText());

            panel.webview.onDidReceiveMessage(async (message: {
                type: string; pattern: string; flags: string; text: string; replacement?: string;
            }) => {
                const timeout = getRegexTimeoutMs();
                if (message.type === 'test') {
                    const result = await runRegexJob(
                        { pattern: message.pattern, flags: normalizeFlags(message.flags), text: message.text, mode: 'exec', maxMatches: 10000 },
                        timeout
                    );
                    panel.webview.postMessage({ type: 'result', matches: result.matches ?? [], error: result.error });
                } else if (message.type === 'replace') {
                    const result = await runRegexJob(
                        { pattern: message.pattern, flags: normalizeFlags(message.flags), text: message.text, mode: 'replace', replacement: message.replacement ?? '' },
                        timeout
                    );
                    panel.webview.postMessage({ type: 'replaceResult', result: result.result ?? message.text, count: result.count ?? 0, error: result.error });
                } else if (message.type === 'apply') {
                    await applyReplacement(message.pattern, message.flags, message.replacement ?? '');
                }
            });

            panel.onDidDispose(() => {
                if (currentPanel === panel) currentPanel = undefined;
            }, null, context.subscriptions);
        })
    );
}

async function applyReplacement(pattern: string, flags: string, replacement: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage(t('Pancho: No active editor'));
        return;
    }
    const target = editor.document.getText(editor.selection);
    const isSelection = target.length > 0;
    const source = isSelection ? target : editor.document.getText();
    const result = await runRegexJob(
        { pattern, flags: normalizeFlags(flags), text: source, mode: 'replace', replacement },
        getRegexTimeoutMs()
    );
    if (result.error || result.result === undefined) {
        vscode.window.showWarningMessage(t('Pancho: {0}', t('Invalid pattern')));
        return;
    }
    const newText = result.result;
    await editor.edit(builder => {
        if (isSelection) {
            builder.replace(editor.selection, newText);
        } else {
            const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            builder.replace(new vscode.Range(editor.document.lineAt(0).range.start, lastLine.range.end), newText);
        }
    });
}
