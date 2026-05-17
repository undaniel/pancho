import * as vscode from 'vscode';

export async function readFromClipboard(): Promise<string> {
    const text = await vscode.env.clipboard.readText();
    return text;
}

export async function writeToClipboard(text: string): Promise<void> {
    await vscode.env.clipboard.writeText(text);
}

export async function clipboardContainsText(): Promise<boolean> {
    const text = await vscode.env.clipboard.readText();
    return text.length > 0;
}