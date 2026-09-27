import * as vscode from 'vscode';
import { t } from './i18n';

const SCHEME = 'pancho-preview';
const MAX_PREVIEW_ENTRIES = 20;
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
    // Bound the cache so long sessions do not accumulate full documents.
    if (contents.size > MAX_PREVIEW_ENTRIES) {
        const oldest = contents.keys().next().value;
        if (oldest !== undefined) contents.delete(oldest);
    }
    return uri;
}

/** Test helper: drops every cached preview document. */
export function clearPreviewCache(): void {
    contents.clear();
}

export function isPreviewEnabled(): boolean {
    return vscode.workspace.getConfiguration('pancho').get<boolean>('previewDestructive', true);
}

export async function confirmWithPreview(original: string, modified: string, label: string): Promise<boolean> {
    if (original === modified) return true;

    const left = storeContent('before', original);
    const right = storeContent('after', modified);
    try {
        await vscode.commands.executeCommand('vscode.diff', left, right, t('Pancho: Preview - {0}', label));

        const apply = t('Apply');
        const choice = await vscode.window.showInformationMessage(
            t('Pancho: Apply these changes?'),
            { modal: true },
            apply
        );
        return choice === apply;
    } finally {
        // Release the (potentially large) document copies once the user decided.
        contents.delete(left.toString());
        contents.delete(right.toString());
    }
}
