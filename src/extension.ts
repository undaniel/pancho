import * as vscode from 'vscode';
import { registerAllCommands } from './commands';

export function activate(context: vscode.ExtensionContext): void {
    vscode.window.showInformationMessage('Pancho extension activated!');
    console.log('[Pancho] Extension activating...');
    registerAllCommands(context);
}

export function deactivate(): void {}