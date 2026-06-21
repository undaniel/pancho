let l10nT: (message: string, ...args: unknown[]) => string;

try {
    const vscode = require('vscode');
    l10nT = (message, ...args) => vscode.l10n.t(message, ...args);
} catch {
    l10nT = (message, ...args) => {
        if (!args.length) return message;
        return message.replace(/\{(\d+)\}/g, (_, i) => String(args[Number(i)] ?? ''));
    };
}

export function t(message: string, ...args: unknown[]): string {
    return l10nT(message, ...args);
}
