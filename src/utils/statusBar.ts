import * as vscode from 'vscode';
import { countWords, countCharacters, countLines } from '../transforms/textGeneral/counters';

let statusBarItem: vscode.StatusBarItem | undefined;
let countersItem: vscode.StatusBarItem | undefined;
let updateTimer: NodeJS.Timeout | undefined;

interface DocumentCounts {
    uri: string;
    version: number;
    lines: number;
    words: number;
    chars: number;
}

let documentCountsCache: DocumentCounts | undefined;

const STATUSBAR_ICON = '$(wand)';
const MAX_COUNTER_LENGTH = 500000;

export function initStatusBar(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem('pancho.status', vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'pancho.showStatusInfo';
    statusBarItem.text = `${STATUSBAR_ICON} Pancho`;
    statusBarItem.tooltip = vscode.l10n.t('Text formatting extension');
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const config = vscode.workspace.getConfiguration('pancho');
    if (config.get<boolean>('statusBarShowCounters', true)) {
        countersItem = vscode.window.createStatusBarItem('pancho.counters', vscode.StatusBarAlignment.Left, 101);
        countersItem.text = '';
        countersItem.tooltip = vscode.l10n.t('Pancho counters');
        countersItem.show();
        context.subscriptions.push(countersItem);

        context.subscriptions.push(
            vscode.window.onDidChangeTextEditorSelection(() => scheduleUpdate())
        );
        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(() => scheduleUpdate())
        );
    }
}

function scheduleUpdate(): void {
    if (updateTimer) {
        clearTimeout(updateTimer);
    }
    updateTimer = setTimeout(() => updateCounters(), 150);
}

function renderCounts(lines: number, words: number, chars: number, isSelection = false): void {
    if (!countersItem) return;
    countersItem.text = `${isSelection ? 'Sel ' : ''}L:${lines} P:${words} C:${chars}`;
    countersItem.tooltip = isSelection
        ? vscode.l10n.t('Pancho counters (selection)')
        : vscode.l10n.t('Pancho counters');
}

export function updateCounters(): void {
    if (!countersItem) return;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        countersItem.text = '';
        countersItem.hide();
        return;
    }
    countersItem.show();

    const selectionText = editor.document.getText(editor.selection);
    if (selectionText.length > 0) {
        if (selectionText.length > MAX_COUNTER_LENGTH) {
            countersItem.text = 'L:? P:? C:?';
            countersItem.tooltip = vscode.l10n.t('Document too large to count');
            return;
        }
        renderCounts(countLines(selectionText), countWords(selectionText), countCharacters(selectionText), true);
        return;
    }

    const uri = editor.document.uri.toString();
    const version = editor.document.version;
    if (documentCountsCache && documentCountsCache.uri === uri && documentCountsCache.version === version) {
        renderCounts(documentCountsCache.lines, documentCountsCache.words, documentCountsCache.chars);
        return;
    }

    const text = editor.document.getText();
    if (text.length > MAX_COUNTER_LENGTH) {
        countersItem.text = 'L:? P:? C:?';
        countersItem.tooltip = vscode.l10n.t('Document too large to count');
        return;
    }

    const counts: DocumentCounts = {
        uri,
        version,
        lines: countLines(text),
        words: countWords(text),
        chars: countCharacters(text),
    };
    documentCountsCache = counts;
    renderCounts(counts.lines, counts.words, counts.chars);
}

export function updateStatusBar(message: string): void {
    if (statusBarItem) {
        statusBarItem.text = `${STATUSBAR_ICON} ${message}`;
        setTimeout(() => {
            if (statusBarItem) {
                statusBarItem.text = `${STATUSBAR_ICON} Pancho`;
            }
        }, 3000);
    }
}

export function showInfo(message: string): void {
    vscode.window.showInformationMessage(`Pancho: ${message}`);
}
