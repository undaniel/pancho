import { t } from '../utils/i18n';
import { runRegexJob } from '../utils/safeRegex';
import type { RegexErrorCode } from '../utils/regexCore';

export interface RegexTestResult {
    matches: { match: string; index: number; groups: string[] }[];
    error?: string;
}

function describeError(code: RegexErrorCode | undefined): string {
    switch (code) {
        case 'empty':
            return t('Empty pattern');
        case 'complex':
            return t('Pattern too complex (possible catastrophic backtracking)');
        case 'timeout':
            return t('Pattern took too long (possible catastrophic backtracking)');
        case 'invalid':
            return t('Invalid pattern');
        default:
            return t('Invalid pattern');
    }
}

export async function testRegex(pattern: string, flags: string, text: string, timeoutMs?: number): Promise<RegexTestResult> {
    if (!pattern) return { matches: [], error: t('Empty pattern') };
    const result = await runRegexJob(
        {
            pattern,
            flags: flags.includes('g') ? flags : flags + 'g',
            text,
            mode: 'exec',
            maxMatches: 10000,
        },
        timeoutMs
    );
    if (result.error) return { matches: [], error: describeError(result.error) };
    return { matches: result.matches ?? [] };
}

export async function formatRegexResult(pattern: string, flags: string, text: string, timeoutMs?: number): Promise<{ result: string; error?: string }> {
    const r = await testRegex(pattern, flags, text, timeoutMs);
    if (r.error) return { result: text, error: r.error };
    if (r.matches.length === 0) return { result: t('No matches found') };
    const lines = r.matches.map((m, i) => {
        const base = `[${i + 1}] "${m.match}" @${m.index}`;
        return m.groups.length > 0 ? base + `  groups: ${JSON.stringify(m.groups)}` : base;
    });
    return { result: `Pattern: /${pattern}/${flags}\nMatches (${r.matches.length}):\n${lines.join('\n')}` };
}
