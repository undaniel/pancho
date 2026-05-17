import * as vscode from 'vscode';

export interface ProgressOptions {
    title: string;
    cancellable?: boolean;
}

export async function withProgress<T>(
    options: ProgressOptions,
    callback: (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => Promise<T>
): Promise<T | undefined> {
    return vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: options.title,
            cancellable: options.cancellable ?? false
        },
        callback
    );
}

export async function runWithProgress<T>(
    title: string,
    task: (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => Promise<T>,
    cancellable: boolean = false
): Promise<T | undefined> {
    return withProgress({ title, cancellable }, task);
}

export function createProgressIncrementer(totalSteps: number): (step: number) => number {
    return (step: number) => Math.floor((step / totalSteps) * 100);
}