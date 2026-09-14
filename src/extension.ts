import * as vscode from 'vscode';
import { registerAllCommands } from './commands';
import { registerMenuCommands } from './commands/menu';
import { registerColumnCommands } from './commands/column';
import { registerMacroCommands } from './commands/macro';
import { registerFilterCommands } from './commands/filter';
import { initStatusBar, updateCounters, showInfo } from './utils/statusBar';
import { disposeRegexWorker } from './utils/safeRegex';
import { registerPreviewProvider } from './utils/preview';

export function activate(context: vscode.ExtensionContext): void {
    console.log('[Pancho] Extension activating...');
    initStatusBar(context);
    registerAllCommands(context);
    registerMenuCommands(context);
    registerColumnCommands(context);
    registerMacroCommands(context);
    registerFilterCommands(context);
    registerPreviewProvider(context);

    context.subscriptions.push(
            vscode.commands.registerCommand('pancho.showStatusInfo', () => {
                showInfo(vscode.l10n.t('Pancho - Clean and format text like Notepad++'));
            })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('pancho')) {
                updateCounters();
            }
        })
    );

    context.subscriptions.push({ dispose: disposeRegexWorker });

    console.log('[Pancho] Extension activated successfully!');
}

export function deactivate(): void {
    disposeRegexWorker();
}