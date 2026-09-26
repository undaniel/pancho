import * as vscode from 'vscode';
import { isEnabled } from './config';
import { t } from './i18n';

let disabledNoticeShown = false;

function notifyDisabled(): void {
    if (disabledNoticeShown) return;
    disabledNoticeShown = true;
    void vscode.window.showWarningMessage(t('Pancho is disabled (pancho.enabled)'));
}

/** Test helper: allows the "disabled" notice to be shown again. */
export function resetDisabledNotice(): void {
    disabledNoticeShown = false;
}

/**
 * Registers a command that honours the `pancho.enabled` master switch.
 * Keeps the disabled check in one place so every entry point behaves the same.
 */
export function registerCommand(
    context: vscode.ExtensionContext,
    id: string,
    handler: (...args: unknown[]) => unknown
): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(id, async (...args: unknown[]) => {
            if (!isEnabled()) {
                notifyDisabled();
                return undefined;
            }
            return handler(...args);
        })
    );
}
