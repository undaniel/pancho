import * as vscode from 'vscode';
import { countWords, countCharacters, countLines } from '../transforms/textGeneral/counters';

let statusBarItem: vscode.StatusBarItem | undefined;
let countersItem: vscode.StatusBarItem | undefined;
let updateTimer: NodeJS.Timeout | undefined;

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

export function updateCounters(): void {
    if (!countersItem) return;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        countersItem.text = '';
        return;
    }

    const selectionText = editor.document.getText(editor.selection);
    const text = selectionText.length > 0 ? selectionText : editor.document.getText();

    if (text.length > MAX_COUNTER_LENGTH) {
        countersItem.text = 'L:? P:? C:?';
        countersItem.tooltip = vscode.l10n.t('Document too large to count');
        return;
    }

    const words = countWords(text);
    const chars = countCharacters(text);
    const lines = countLines(text);

    countersItem.text = `L:${lines} P:${words} C:${chars}`;
    countersItem.tooltip = vscode.l10n.t('Pancho counters');
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

export function showError(message: string): void {
    vscode.window.showErrorMessage(`Pancho: ${message}`);
}

export function showWarning(message: string): void {
    vscode.window.showWarningMessage(`Pancho: ${message}`);
}

export function showInfo(message: string): void {
    vscode.window.showInformationMessage(`Pancho: ${message}`);
}
