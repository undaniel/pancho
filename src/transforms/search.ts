import { sanitizeSearchPattern } from '../utils/sanitize';
import { t } from '../utils/i18n';
import { runRegexJob } from '../utils/safeRegex';
import type { RegexErrorCode } from '../utils/regexCore';

function describeError(code: RegexErrorCode | undefined): string {
    switch (code) {
        case 'empty':
            return t('Empty pattern');
        case 'complex':
            return t('Pattern too complex (possible catastrophic backtracking)');
        case 'timeout':
            return t('Pattern took too long (possible catastrophic backtracking)');
        default:
            return t('Invalid pattern');
    }
}

export async function highlightMatches(text: string, pattern: string, timeoutMs?: number): Promise<{ result: string; error?: string }> {
    const sanitized = sanitizeSearchPattern(pattern);
    if (!sanitized) return { result: text, error: t('Empty pattern') };
    const result = await runRegexJob(
        { pattern: sanitized, flags: 'gi', text, mode: 'replace', replacement: '==$0==', maxMatches: 100000 },
        timeoutMs
    );
    if (result.error) return { result: text, error: describeError(result.error) };
    return { result: result.result ?? text };
}

export async function countMatches(text: string, pattern: string, timeoutMs?: number): Promise<{ result: number; error?: string }> {
    const sanitized = sanitizeSearchPattern(pattern);
    if (!sanitized) return { result: 0 };
    const result = await runRegexJob(
        { pattern: sanitized, flags: 'gi', text, mode: 'count', maxMatches: 100000 },
        timeoutMs
    );
    if (result.error) return { result: 0, error: describeError(result.error) };
    return { result: result.count ?? 0 };
}
