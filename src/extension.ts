import * as vscode from 'vscode';
import { registerAllCommands } from './commands';
import { initStatusBar, updateCounters, showInfo } from './utils/statusBar';

export function activate(context: vscode.ExtensionContext): void {
    console.log('[Pancho] Extension activating...');
    initStatusBar(context);
    registerAllCommands(context);

    context.subscriptions.push(
        vscode.commands.registerCommand('pancho.showStatusInfo', () => {
            showInfo('Pancho - Limpia y formatear texto como Notepad++');
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('pancho')) {
                updateCounters();
            }
        })
    );

    console.log('[Pancho] Extension activated successfully!');
}

export function deactivate(): void {}