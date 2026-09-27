import * as vscode from 'vscode';

/**
 * Lightweight bus so the Activity Bar views refresh when favorites, recents or
 * pipelines change, without importing each other.
 */
const emitter = new vscode.EventEmitter<void>();

export const onDidChangeCommandLists = emitter.event;

export function fireCommandListsChanged(): void {
    emitter.fire();
}
