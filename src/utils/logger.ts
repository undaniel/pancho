import * as vscode from 'vscode';

const EXTENSION_ID = 'undaniels.pancho-plus-plus';

let channel: vscode.LogOutputChannel | undefined;

/** Creates the "Pancho" output channel and logs the activation banner. */
export function initLogger(context: vscode.ExtensionContext): void {
    if (!channel) {
        channel = vscode.window.createOutputChannel('Pancho', { log: true });
        context.subscriptions.push(channel);
    }
    channel.info(`Pancho ${extensionVersion()} activated (VS Code ${vscode.version}, ${uiKind()})`);
}

export function logInfo(message: string): void {
    channel?.info(message);
}

export function logError(message: string, error?: unknown): void {
    channel?.error(error === undefined ? message : `${message}: ${describe(error)}`);
}

/** Shows the output channel, creating it on demand (e.g. when logs are opened before activation). */
export function showLogs(): void {
    if (!channel) {
        channel = vscode.window.createOutputChannel('Pancho', { log: true });
    }
    channel.show(true);
}

export function extensionVersion(): string {
    return vscode.extensions.getExtension(EXTENSION_ID)?.packageJSON?.version ?? 'unknown';
}

/** Opens a prefilled GitHub issue with the environment details we always ask for. */
export async function reportIssue(): Promise<void> {
    const body = [
        '### What happened?',
        '',
        '',
        '### Expected behavior',
        '',
        '',
        '### Steps to reproduce',
        '1. ',
        '',
        '### Environment',
        `- Pancho: ${extensionVersion()}`,
        `- VS Code: ${vscode.version}`,
        `- Host: ${uiKind()}`,
        `- Language: ${vscode.env.language}`,
        '',
        '_Tip: run "Pancho: Show logs" and paste any relevant lines above._',
    ].join('\n');

    const url = `https://github.com/undaniel/pancho/issues/new?body=${encodeURIComponent(body)}`;
    await vscode.env.openExternal(vscode.Uri.parse(url));
}

function uiKind(): string {
    return vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop';
}

function describe(error: unknown): string {
    if (error instanceof Error) return error.stack ?? error.message;
    return String(error);
}
