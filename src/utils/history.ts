import * as vscode from 'vscode';
import { CommandName, Commands } from '../commands/registry';
import { t } from './i18n';

const LAST_COMMAND_KEY = 'pancho.lastCommand';

const NON_REPEATABLE = new Set<string>([Commands.REPEAT_LAST, Commands.SHOW_MENU]);

export async function recordLastCommand(context: vscode.ExtensionContext, command: CommandName): Promise<void> {
    if (NON_REPEATABLE.has(command)) return;
    try {
        await context.workspaceState.update(LAST_COMMAND_KEY, command);
    } catch {
        // History is best-effort; never block a command because of it.
    }
}

export function getLastCommand(context: vscode.ExtensionContext): string | undefined {
    return context.workspaceState.get<string>(LAST_COMMAND_KEY);
}

export function registerRepeatCommand(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.REPEAT_LAST, async () => {
            const last = getLastCommand(context);
            if (!last) {
                vscode.window.showWarningMessage(t('Pancho: Nothing to repeat'));
                return;
            }
            await vscode.commands.executeCommand(last);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.REPEAT_LAST_TIMES, async () => {
            const last = getLastCommand(context);
            if (!last) {
                vscode.window.showWarningMessage(t('Pancho: Nothing to repeat'));
                return;
            }
            const input = await vscode.window.showInputBox({ prompt: t('How many times?'), value: '2' });
            if (input === undefined) return;
            const count = Number.parseInt(input, 10);
            if (!Number.isInteger(count) || count < 1 || count > 100) {
                vscode.window.showWarningMessage(t('Pancho: Enter a number between 1 and 100'));
                return;
            }
            for (let i = 0; i < count; i++) {
                await vscode.commands.executeCommand(last);
            }
        })
    );
}
