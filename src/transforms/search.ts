import { sanitizeSearchPattern } from '../utils/sanitize';
import { t } from '../utils/i18n';

export function highlightMatches(text: string, pattern: string): { result: string; error?: string } {
    const sanitized = sanitizeSearchPattern(pattern);
    if (!sanitized) {
        return { result: text, error: t('Empty pattern') };
    }
    try {
        const regex = new RegExp(sanitized, 'gi');
        return { result: text.replace(regex, '==$0==') };
    } catch {
        return { result: text, error: t('Invalid pattern') };
    }
}

export function countMatches(text: string, pattern: string): { result: number; error?: string } {
    const sanitized = sanitizeSearchPattern(pattern);
    if (!sanitized) {
        return { result: 0 };
    }
    try {
        const regex = new RegExp(sanitized, 'gi');
        const matches = text.match(regex);
        return { result: matches ? matches.length : 0 };
    } catch {
        return { result: 0, error: t('Invalid pattern') };
    }
}
