import * as vscode from 'vscode';
import { Commands } from '../commands/registry';
import { runRegexJob } from '../utils/safeRegex';
import { getRegexTimeoutMs } from '../utils/config';
import { t } from '../utils/i18n';
import { registerCommand } from '../utils/register';

const MAX_SAMPLE_LENGTH = 200_000;
const HISTORY_KEY = 'pancho.regexHistory';
const SAVED_KEY = 'pancho.regexSaved';
const MAX_HISTORY = 20;

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

interface PanelBoot {
    sample: string;
    history: string[];
    saved: SavedPattern[];
}

function html(boot: PanelBoot): string {
    const n = nonce();
    const csp = `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${n}';`;
    const labels = {
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
        deleteLabel: t('Delete'),
        copy: t('Copy'),
        previous: t('Previous match'),
        next: t('Next match'),
    };
    const ui = {
        matches: t('{0} match(es)'),
        replaced: t('{0} replaced'),
        copied: t('Copied to the clipboard'),
    };
    const bootJson = JSON.stringify(boot).replace(/</g, '\\u003c').replace(/<\/script/gi, '<\\/script');
    const uiJson = JSON.stringify(ui).replace(/</g, '\\u003c').replace(/<\/script/gi, '<\\/script');
    const lang = escapeHtml(vscode.env.language || 'en');
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="${csp}" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 12px; }
  h2 { margin: 0 0 8px; font-size: 1.1em; font-weight: 600; }
  section { border-top: 1px solid var(--vscode-panel-border); padding-top: 10px; margin-top: 10px; }
  section:first-of-type { border-top: none; padding-top: 0; margin-top: 0; }
  label { display: block; margin: 8px 0 2px; font-size: 0.85em; color: var(--vscode-descriptionForeground); }
  input[type=text], textarea, select { width: 100%; box-sizing: border-box; background: var(--vscode-input-background);
    color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, transparent); padding: 4px 6px;
    border-radius: 2px; font-family: inherit; }
  input[type=text]:focus, textarea:focus, select:focus { outline: 1px solid var(--vscode-focusBorder); outline-offset: -1px; }
  textarea { min-height: 120px; font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size, 13px); }
  .row { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }
  .row > .field { flex: 1; min-width: 120px; }
  .row > .flags { flex: 0 0 90px; }
  button { border: none; padding: 5px 12px; cursor: pointer; border-radius: 2px; font-family: inherit; }
  button.primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
  button.primary:hover { background: var(--vscode-button-hoverBackground); }
  button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
  button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground, var(--vscode-button-secondaryBackground)); }
  .toolbar { margin-top: 8px; }
  .toolbar button { min-width: 34px; }
  #result { margin-top: 8px; min-height: 1.2em; }
  #highlights { margin-top: 8px; padding: 6px; border: 1px solid var(--vscode-panel-border); max-height: 240px;
    overflow: auto; white-space: pre-wrap; font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size, 13px); }
  mark { background: var(--vscode-editor-findMatchHighlightBackground); color: inherit; }
  mark.active { outline: 1px solid var(--vscode-focusBorder); }
  .error { color: var(--vscode-errorForeground); }
  .muted { color: var(--vscode-descriptionForeground); }
</style>
</head>
<body>
  <h2>${escapeHtml(labels.pattern)}</h2>
  <section>
    <div class="row">
      <div class="field">
        <label for="pattern">${escapeHtml(labels.pattern)}</label>
        <input id="pattern" type="text" placeholder="\\d+" spellcheck="false" />
      </div>
      <div class="flags">
        <label for="flags">${escapeHtml(labels.flags)}</label>
        <input id="flags" type="text" value="g" spellcheck="false" />
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label for="history">${escapeHtml(labels.history)}</label>
        <select id="history"><option value="">—</option></select>
      </div>
      <div class="field">
        <label for="saved">${escapeHtml(labels.saved)}</label>
        <select id="saved"><option value="">—</option></select>
      </div>
    </div>
    <div class="row" style="margin-top:8px">
      <input id="saveName" type="text" placeholder="${escapeHtml(labels.name)}" aria-label="${escapeHtml(labels.name)}" />
      <button id="save" class="secondary">${escapeHtml(labels.save)}</button>
      <button id="deleteSaved" class="secondary">${escapeHtml(labels.deleteLabel)}</button>
    </div>
  </section>
  <section>
    <label for="text">${escapeHtml(labels.testText)}</label>
    <textarea id="text" spellcheck="false"></textarea>
    <div id="result" class="muted" role="status" aria-live="polite"></div>
    <div class="row toolbar">
      <button id="previous" class="secondary" title="${escapeHtml(labels.previous)}" aria-label="${escapeHtml(labels.previous)}">↑</button>
      <button id="next" class="secondary" title="${escapeHtml(labels.next)}" aria-label="${escapeHtml(labels.next)}">↓</button>
      <button id="copy" class="secondary">${escapeHtml(labels.copy)}</button>
    </div>
    <div id="highlights"></div>
  </section>
  <section>
    <label for="replacement">${escapeHtml(labels.replaceWith)}</label>
    <input id="replacement" type="text" spellcheck="false" />
    <div class="row" style="margin-top:8px">
      <button id="preview" class="secondary">${escapeHtml(labels.preview)}</button>
      <button id="apply" class="primary">${escapeHtml(labels.apply)}</button>
    </div>
  </section>
<script nonce="${n}">
  const vscode = acquireVsCodeApi();
  const $ = id => document.getElementById(id);
  const boot = ${bootJson};
  const ui = ${uiJson};
  const state = vscode.getState() || {};

  $('pattern').value = state.pattern ?? '';
  $('flags').value = state.flags ?? 'g';
  $('text').value = state.text ?? boot.sample;
  $('replacement').value = state.replacement ?? '';

  function persist() {
    vscode.setState({
      pattern: $('pattern').value,
      flags: $('flags').value,
      text: $('text').value,
      replacement: $('replacement').value,
    });
  }

  function fillSelect(select, values, labeler) {
    select.innerHTML = '<option value="">—</option>';
    values.forEach((value, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = labeler(value);
      select.appendChild(option);
    });
  }
  function renderHistory() { fillSelect($('history'), boot.history, p => p); }
  function renderSaved() { fillSelect($('saved'), boot.saved, s => s.name); }

  let timer;
  function sendTest() {
    persist();
    vscode.postMessage({ type: 'test', pattern: $('pattern').value, flags: $('flags').value, text: $('text').value });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(sendTest, 200); }
  ['pattern', 'flags', 'text', 'replacement'].forEach(id => $(id).addEventListener('input', () => { persist(); schedule(); }));

  $('history').addEventListener('change', () => {
    const item = boot.history[Number($('history').value)];
    if (!item) return;
    $('pattern').value = item;
    sendTest();
  });
  $('saved').addEventListener('change', () => {
    const item = boot.saved[Number($('saved').value)];
    if (!item) return;
    $('pattern').value = item.pattern;
    $('flags').value = item.flags;
    sendTest();
  });
  $('save').addEventListener('click', () => {
    const name = $('saveName').value.trim() || $('pattern').value;
    vscode.postMessage({ type: 'save', name, pattern: $('pattern').value, flags: $('flags').value });
  });
  $('deleteSaved').addEventListener('click', () => {
    const item = boot.saved[Number($('saved').value)];
    if (item) vscode.postMessage({ type: 'deleteSaved', name: item.name });
  });
  $('preview').addEventListener('click', () => {
    vscode.postMessage({ type: 'replace', pattern: $('pattern').value, flags: $('flags').value,
      text: $('text').value, replacement: $('replacement').value });
  });
  $('apply').addEventListener('click', () => {
    vscode.postMessage({ type: 'apply', pattern: $('pattern').value, flags: $('flags').value,
      replacement: $('replacement').value });
  });
  $('copy').addEventListener('click', () => {
    vscode.postMessage({ type: 'copy', text: $('text').value });
  });

  let activeMatch = -1;
  function focusMatch(delta) {
    const marks = document.querySelectorAll('#highlights mark');
    if (marks.length === 0) return;
    marks.forEach(m => m.classList.remove('active'));
    activeMatch = (activeMatch + delta + marks.length) % marks.length;
    const target = marks[activeMatch];
    target.classList.add('active');
    target.scrollIntoView({ block: 'center' });
  }
  $('next').addEventListener('click', () => focusMatch(1));
  $('previous').addEventListener('click', () => focusMatch(-1));

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      sendTest();
    }
  });

  window.addEventListener('message', event => {
    const message = event.data;
    if (message.type === 'result') {
      const result = $('result');
      const highlights = $('highlights');
      highlights.innerHTML = '';
      activeMatch = -1;
      if (message.error) { result.className = 'error'; result.textContent = message.error; return; }
      const matches = message.matches || [];
      result.className = 'muted';
      result.textContent = ui.matches.replace('{0}', matches.length);
      let last = 0;
      const source = $('text').value;
      for (const match of matches) {
        highlights.appendChild(document.createTextNode(source.slice(last, match.index)));
        const mark = document.createElement('mark');
        mark.textContent = match.match;
        const named = match.namedGroups && Object.keys(match.namedGroups).length
          ? ' ' + Object.entries(match.namedGroups).map(([k, v]) => k + '=' + v).join(', ')
          : '';
        if (named) mark.title = named.trim();
        highlights.appendChild(mark);
        last = match.index + match.match.length;
      }
      highlights.appendChild(document.createTextNode(source.slice(last)));
    } else if (message.type === 'replaceResult') {
      const result = $('result');
      result.className = message.error ? 'error' : 'muted';
      result.textContent = message.error ? message.error : ui.replaced.replace('{0}', message.count);
      $('text').value = message.result;
      persist();
    } else if (message.type === 'copied') {
      const result = $('result');
      result.className = 'muted';
      result.textContent = ui.copied;
    } else if (message.type === 'history') {
      boot.history = message.history;
      renderHistory();
    } else if (message.type === 'saved') {
      boot.saved = message.saved;
      renderSaved();
    }
  });
  renderHistory();
  renderSaved();
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
    registerCommand(context, Commands.REGEX_TESTER_PANEL, () => {
        const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;
        if (currentPanel) {
            currentPanel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(
            'panchoRegexTester',
            t('Pancho: Regex tester'),
            column,
            { enableScripts: true }
        );
        currentPanel = panel;
        panel.webview.html = html({
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
    const target = editor.document.getText(editor.selection);
    const isSelection = target.length > 0;
    const source = isSelection ? target : editor.document.getText();
    const result = await runRegexJob(
        { pattern, flags: normalizeFlags(flags), text: source, mode: 'replace', replacement },
        { timeoutMs: getRegexTimeoutMs() }
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
