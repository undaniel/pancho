import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem | undefined;

export function initStatusBar(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem('pancho.status', vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'pancho.showStatusInfo';
    statusBarItem.text = 'Pancho';
    statusBarItem.tooltip = 'Ver información de Pancho';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function updateStatusBar(message: string): void {
    if (statusBarItem) {
        statusBarItem.text = `Pancho: ${message}`;
        setTimeout(() => {
            if (statusBarItem) {
                statusBarItem.text = 'Pancho';
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