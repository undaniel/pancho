import * as vscode from 'vscode';
import { countWords, countCharacters, countLines } from '../transforms/textGeneral/counters';

let statusBarItem: vscode.StatusBarItem | undefined;
let countersItem: vscode.StatusBarItem | undefined;

export function initStatusBar(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem('pancho.status', vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'pancho.showStatusInfo';
    statusBarItem.text = '$(pancho) Pancho';
    statusBarItem.tooltip = 'Extensión de formateo de texto';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const config = vscode.workspace.getConfiguration('pancho');
    if (config.get<boolean>('statusBarShowCounters', true)) {
        countersItem = vscode.window.createStatusBarItem('pancho.counters', vscode.StatusBarAlignment.Left, 101);
        countersItem.text = '';
        countersItem.tooltip = 'Contadores de Pancho';
        countersItem.show();
        context.subscriptions.push(countersItem);

        context.subscriptions.push(
            vscode.window.onDidChangeTextEditorSelection(() => updateCounters())
        );
    }
}

export function updateCounters(): void {
    if (!countersItem) return;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        countersItem.text = '';
        return;
    }

    const text = editor.document.getText(editor.selection) || editor.document.getText();
    const words = countWords(text);
    const chars = countCharacters(text);
    const lines = countLines(text);

    countersItem.text = `L:${lines} P:${words} C:${chars}`;
}

export function updateStatusBar(message: string): void {
    if (statusBarItem) {
        statusBarItem.text = `$(pancho) ${message}`;
        setTimeout(() => {
            if (statusBarItem) {
                statusBarItem.text = '$(pancho) Pancho';
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