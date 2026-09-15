import * as vscode from 'vscode';

export function getConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration('pancho');
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
