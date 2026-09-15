import * as vscode from 'vscode';
import { t } from './i18n';

const SCHEME = 'pancho-preview';
let sequence = 0;
const contents = new Map<string, string>();

export function registerPreviewProvider(context: vscode.ExtensionContext): void {
    const provider: vscode.TextDocumentContentProvider = {
        provideTextDocumentContent(uri: vscode.Uri): string {
            return contents.get(uri.toString()) ?? '';
        },
    };
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(SCHEME, provider));
}

function storeContent(name: string, content: string): vscode.Uri {
    const uri = vscode.Uri.parse(`${SCHEME}:${name}-${sequence++}.txt`);
    contents.set(uri.toString(), content);
    return uri;
}

export function isPreviewEnabled(): boolean {
    return vscode.workspace.getConfiguration('pancho').get<boolean>('previewDestructive', false);
}

export async function confirmWithPreview(original: string, modified: string, label: string): Promise<boolean> {
    if (original === modified) return true;

    const left = storeContent('before', original);
    const right = storeContent('after', modified);
    await vscode.commands.executeCommand('vscode.diff', left, right, t('Pancho: Preview - {0}', label));

    const apply = t('Apply');
    const choice = await vscode.window.showInformationMessage(
        t('Pancho: Apply these changes?'),
        { modal: true },
        apply
    );
    return choice === apply;
}
