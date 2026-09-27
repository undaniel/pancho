import * as vscode from 'vscode';
import { Commands } from './registry';
import { smartActionsFor } from '../providers/codeActions';
import { registerCommand } from '../utils/register';
import { t } from '../utils/i18n';

function contentUnderTest(editor: vscode.TextEditor): string {
    if (!editor.selection.isEmpty) return editor.document.getText(editor.selection);
    return editor.document.lineAt(editor.selection.active.line).text.trim();
}

export function registerSmartActions(context: vscode.ExtensionContext): void {
    registerCommand(context, Commands.SMART_ACTIONS, async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage(t('Pancho: No active editor'));
            return;
        }

        const specs = smartActionsFor(contentUnderTest(editor));
        if (specs.length === 0) {
            vscode.window.showInformationMessage(t('No smart actions for the current content'));
            return;
        }

        const picked = await vscode.window.showQuickPick(
            specs.map(spec => ({ label: spec.title, command: spec.command })),
            { title: t('Smart actions') }
        );
        if (!picked) return;
        await vscode.commands.executeCommand(picked.command);
    });
}
