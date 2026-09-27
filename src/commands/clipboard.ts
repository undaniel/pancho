import * as vscode from 'vscode';
import { Commands } from './registry';
import { ClipboardHistory } from '../utils/clipboardHistory';
import { insertAtCursors } from '../utils/editor';
import { getConfig } from '../utils/config';
import { registerCommand } from '../utils/register';

const STORAGE_KEY = 'pancho.clipboardHistory';
const POLL_INTERVAL_MS = 1200;
const DETAIL_MAX_LINES = 20;

function preview(text: string): string {
    const firstLine = text.split('\n')[0];
    const clipped = firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine;
    const extra = text.includes('\n') ? ` (+${text.split('\n').length - 1} lines)` : '';
    return clipped + extra;
}

function detail(text: string): string {
    const lines = text.split('\n').slice(0, DETAIL_MAX_LINES);
    const shown = lines.join('\n');
    const truncated = text.split('\n').length > DETAIL_MAX_LINES;
    return truncated ? `${shown}\n…` : shown;
}

export function registerClipboardCommands(context: vscode.ExtensionContext): void {
    const history = new ClipboardHistory(getConfig().get<number>('clipboardHistorySize', 20));
    history.load(context.globalState.get('pancho.clipboardHistory', []) as never);

    let lastPersist = 0;
    let timer: NodeJS.Timeout | undefined;

    const persist = (): void => {
        const now = Date.now();
        if (now - lastPersist < 3000) return;
        lastPersist = now;
        void context.globalState.update(STORAGE_KEY, history.list());
    };

    const startPolling = (): void => {
        if (timer) return;
        timer = setInterval(async () => {
            try {
                const text = await vscode.env.clipboard.readText();
                if (history.push(text)) persist();
            } catch {
                // Clipboard can be unavailable in some environments; ignore.
            }
        }, POLL_INTERVAL_MS);
    };

    if (getConfig().get<boolean>('clipboardHistoryEnabled', true)) {
        startPolling();
    }

    registerCommand(context, Commands.CLIPBOARD_HISTORY, async () => {
        const entries = history.list();
        if (entries.length === 0) {
            vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Clipboard history is empty'));
            return;
        }
        const pick = await vscode.window.showQuickPick(
            entries.map(entry => ({
                label: preview(entry.text),
                description: new Date(entry.time).toLocaleString(),
                detail: detail(entry.text),
                text: entry.text,
            })),
            { placeHolder: vscode.l10n.t('Pancho: Clipboard history'), matchOnDescription: true }
        );
        if (!pick) return;
        await insertAtCursors(pick.text);
    });

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (!event.affectsConfiguration('pancho')) return;
            history.setMaxSize(getConfig().get<number>('clipboardHistorySize', 20));
            if (getConfig().get<boolean>('clipboardHistoryEnabled', true)) startPolling();
            else if (timer) {
                clearInterval(timer);
                timer = undefined;
            }
        })
    );

    context.subscriptions.push({
        dispose: () => {
            if (timer) clearInterval(timer);
        },
    });
}
