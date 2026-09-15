import * as vscode from 'vscode';
import { Commands } from './registry';
import { registerPromptCommand } from './factory';
import { runRegexJob } from '../utils/safeRegex';
import type { RegexErrorCode } from '../utils/regexCore';
import { getRegexTimeoutMs } from '../utils/config';
import { computeLineStarts, lineIndexAtOffset } from '../core/textOffsets';

function describeError(code: RegexErrorCode | undefined): string {
    return code === 'empty' ? vscode.l10n.t('Empty pattern') : vscode.l10n.t('Invalid pattern');
}

async function matchingLineIndices(text: string, pattern: string): Promise<{ lines?: Set<number>; error?: string }> {
    const result = await runRegexJob(
        { pattern, flags: 'gi', text, mode: 'exec', maxMatches: 1000000 },
        getRegexTimeoutMs()
    );
    if (result.error) return { error: describeError(result.error) };

    const lineStarts = computeLineStarts(text);
    const lines = new Set<number>();
    for (const match of result.matches ?? []) {
        lines.add(lineIndexAtOffset(lineStarts, match.index));
    }
    return { lines };
}

export function registerFilterCommands(context: vscode.ExtensionContext): void {
    const prompt = [{ label: vscode.l10n.t('Regex pattern'), placeholder: '\\d+' }];

    registerPromptCommand(context, {
        command: Commands.FILTER_LINES_BY_REGEX,
        prompts: prompt,
        transform: async (text, pattern) => {
            if (!pattern) return { result: text, error: vscode.l10n.t('Empty pattern') };
            const { lines, error } = await matchingLineIndices(text, pattern);
            if (error || !lines) return { result: text, error };
            return text.split('\n').filter((_, index) => lines.has(index)).join('\n');
        },
    });

    registerPromptCommand(context, {
        command: Commands.REMOVE_LINES_BY_REGEX,
        prompts: prompt,
        transform: async (text, pattern) => {
            if (!pattern) return { result: text, error: vscode.l10n.t('Empty pattern') };
            const { lines, error } = await matchingLineIndices(text, pattern);
            if (error || !lines) return { result: text, error };
            return text.split('\n').filter((_, index) => !lines.has(index)).join('\n');
        },
    });
}
