import * as vscode from 'vscode';
import { registerAllCommands } from './commands';
import { registerMenuCommands } from './commands/menu';
import { registerColumnCommands } from './commands/column';
import { registerMacroCommands } from './commands/macro';
import { registerFilterCommands } from './commands/filter';
import { initStatusBar, updateCounters, showCountsInfo } from './utils/statusBar';
import { disposeRegexWorker } from './utils/safeRegex';
import { registerPreviewProvider } from './utils/preview';
import { registerClipboardCommands } from './commands/clipboard';
import { registerHoverProvider } from './providers/hover';
import { registerCodeActionsProvider } from './providers/codeActions';
import { registerRegexPanel } from './providers/regexPanel';
import { registerSmartActions } from './commands/smartActions';
import { registerPipelineCommands } from './commands/pipeline';
import { registerActivityView } from './providers/activityView';
import { registerCommand } from './utils/register';

const WALKTHROUGH_SHOWN_KEY = 'pancho.walkthroughShown';

/** Opens the walkthrough once, on first activation. */
function maybeOpenWalkthrough(context: vscode.ExtensionContext): void {
    if (context.globalState.get<boolean>(WALKTHROUGH_SHOWN_KEY)) return;
    void context.globalState.update(WALKTHROUGH_SHOWN_KEY, true);
    const extensionId = context.extension?.id ?? 'undaniels.pancho-plus-plus';
    setTimeout(() => {
        void vscode.commands.executeCommand(
            'workbench.action.openWalkthrough',
            `${extensionId}#pancho.walkthrough`,
            false
        );
    }, 1500);
}

export function activate(context: vscode.ExtensionContext): void {
    console.log('[Pancho] Extension activating...');
    initStatusBar(context);
    registerAllCommands(context);
    registerMenuCommands(context);
    registerColumnCommands(context);
    registerMacroCommands(context);
    registerFilterCommands(context);
    registerClipboardCommands(context);
    registerPreviewProvider(context);
    registerHoverProvider(context);
    registerCodeActionsProvider(context);
    registerRegexPanel(context);
    registerSmartActions(context);
    registerPipelineCommands(context);
    registerActivityView(context);

    registerCommand(context, 'pancho.showStatusInfo', () => {
        showCountsInfo();
    });

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('pancho')) {
                updateCounters();
            }
        })
    );

    context.subscriptions.push({ dispose: disposeRegexWorker });

    maybeOpenWalkthrough(context);

    console.log('[Pancho] Extension activated successfully!');
}

export function deactivate(): void {
    disposeRegexWorker();
}