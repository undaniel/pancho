import * as vscode from 'vscode';
import { buildHover, findHoverCandidate } from '../transforms/hoverInfo';

export function registerHoverProvider(context: vscode.ExtensionContext): void {
    const provider: vscode.HoverProvider = {
        provideHover(document, position) {
            const lineStart = document.lineAt(position.line).range.start;
            const character = document.offsetAt(position) - document.offsetAt(lineStart);
            const candidate = findHoverCandidate(document.lineAt(position.line).text, character);
            if (!candidate) return undefined;

            const info = buildHover(candidate.token);
            if (!info) return undefined;

            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${info.title}**\n\n`);
            markdown.appendCodeblock(info.lines.join('\n'), info.kind === 'jwt' || info.kind === 'base64' ? 'json' : 'text');

            const base = document.offsetAt(lineStart);
            const range = new vscode.Range(
                document.positionAt(base + candidate.start),
                document.positionAt(base + candidate.end)
            );
            return new vscode.Hover(markdown, range);
        },
    };
    context.subscriptions.push(vscode.languages.registerHoverProvider('*', provider));
}
