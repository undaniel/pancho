import * as vscode from 'vscode';
import { t } from './i18n';

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

const ISSUE_URL = 'https://github.com/undaniel/pancho/issues/new';

/**
 * Markdown for the prefilled issue body.
 *
 * Deliberately avoids `#`, `&`, `?` and `+`. `vscode.env.openExternal` runs
 * `encodeURI(uri.toString(true))` over the URL (microsoft/vscode#135949), which
 * re-encodes `%`; VS Code additionally escapes `?` when serialising the query.
 * The net effect is that `#`, `&`, `?` and `+` cannot be represented reliably
 * (`#` starts a URL fragment, `&` splits the query, `?`/`+` end up
 * double-encoded or decoded as a space). Everything else the body uses
 * (spaces, newlines, `:`, quotes, `*`, `_`, `-`) survives and is decoded by
 * GitHub, so the body reaches the form intact. `reportIssue` guards the
 * invariant and falls back to the clipboard if it is ever broken.
 */
export function buildIssueBody(): string {
    return [
        '**What happened**',
        '',
        '',
        '**Expected behavior**',
        '',
        '',
        '**Steps to reproduce**',
        '1. ',
        '',
        '**Environment**',
        `- Pancho: ${extensionVersion()}`,
        `- VS Code: ${vscode.version}`,
        `- Host: ${uiKind()}`,
        `- Language: ${vscode.env.language}`,
        '',
        '_Tip: run "Pancho: Show logs" and paste any relevant lines above._',
    ].join('\n');
}

export function buildIssueUri(): vscode.Uri {
    return vscode.Uri.parse(ISSUE_URL).with({ query: `body=${buildIssueBody()}` });
}

/** Opens a prefilled GitHub issue with the environment details we always ask for. */
export async function reportIssue(): Promise<void> {
    const body = buildIssueBody();
    if (/[#&?+]/.test(body)) {
        // Should never happen (see buildIssueBody); the URL transport cannot
        // carry these, so hand the body over through the clipboard instead.
        await vscode.env.clipboard.writeText(body);
        await vscode.env.openExternal(vscode.Uri.parse(`${ISSUE_URL}?template=bug_report.yml`));
        void vscode.window.showInformationMessage(
            t('Pancho: the issue details were copied to the clipboard — paste them into the description.')
        );
        return;
    }
    await vscode.env.openExternal(buildIssueUri());
}

function uiKind(): string {
    return vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop';
}

function describe(error: unknown): string {
    if (error instanceof Error) return error.stack ?? error.message;
    return String(error);
}
