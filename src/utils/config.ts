import * as vscode from 'vscode';

export function getConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration('pancho');
}

/** Master switch. When false, Pancho commands and providers stay inert. */
export function isEnabled(): boolean {
    return getConfig().get<boolean>('enabled', true);
}

/**
 * Preview every whole-document change (not only the destructive ones) in a
 * diff before applying it.
 */
export function isPreviewAllEnabled(): boolean {
    return getConfig().get<boolean>('previewAllChanges', false);
}

export function getRegexTimeoutMs(): number {
    return getConfig().get<number>('regexTimeoutMs', 2000);
}

export function getLoremIpsumWordCount(): number {
    return getConfig().get<number>('loremIpsumWordCount', 50);
}

export function getRandomStringLength(): number {
    return getConfig().get<number>('randomStringLength', 16);
}
