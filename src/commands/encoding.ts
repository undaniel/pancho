import * as vscode from 'vscode';
import { Commands } from './registry';
import { detectEncoding } from '../features/encoding';

export function registerEncodingCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.ENCODING_INFO, async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No active editor'));
                return;
            }
            try {
                const bytes = await vscode.workspace.fs.readFile(editor.document.uri);
                const info = detectEncoding(bytes);
                vscode.window.showInformationMessage(
                    vscode.l10n.t('Pancho: Detected encoding: {0}{1}', info.encoding, info.bom ? ' (BOM)' : '')
                );
            } catch {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Cannot read file'));
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.CHANGE_ENCODING, () =>
            vscode.commands.executeCommand('workbench.action.editor.changeEncoding')
        )
    );
}
