import * as vscode from 'vscode';
import { buildHover, findHoverCandidate, HoverInfo } from '../transforms/hoverInfo';
import { Commands } from '../commands/registry';
import { isEnabled } from '../utils/config';
import { t } from '../utils/i18n';

/** Most likely command for each detected token kind. */
const ACTION_FOR_KIND: Record<HoverInfo['kind'], string> = {
    jwt: Commands.DECODE_JWT,
    color: Commands.COLOR_INFO,
    timestamp: Commands.TIMESTAMP_TO_ISO,
    base64: Commands.BASE64_DECODE,
};

export function registerHoverProvider(context: vscode.ExtensionContext): void {
    const provider: vscode.HoverProvider = {
        provideHover(document, position) {
            if (!isEnabled()) return undefined;
            const lineStart = document.lineAt(position.line).range.start;
            const character = document.offsetAt(position) - document.offsetAt(lineStart);
            const candidate = findHoverCandidate(document.lineAt(position.line).text, character);
            if (!candidate) return undefined;

            const info = buildHover(candidate.token);
            if (!info) return undefined;

            const markdown = new vscode.MarkdownString();
            markdown.supportThemeIcons = true;
            markdown.isTrusted = true;
            markdown.appendMarkdown(`**${info.title}**\n\n`);
            markdown.appendCodeblock(info.lines.join('\n'), info.kind === 'jwt' || info.kind === 'base64' ? 'json' : 'text');

            // Offer the matching action plus the content-aware picker, right from the hover.
            const specific = ACTION_FOR_KIND[info.kind];
            const links = [
                `[$(wand) ${t('Smart actions')}](command:${Commands.SMART_ACTIONS})`,
            ];
            if (specific) links.unshift(`[$(play) ${t('Apply')}](command:${specific})`);
            markdown.appendMarkdown(`\n\n${links.join(' · ')}`);

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
