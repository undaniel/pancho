import { sanitizeRegexPattern, sanitizeSearchPattern, truncateText } from '../utils/sanitize';

export function highlightMatches(text: string, pattern: string): { result: string; error?: string } {
    const sanitized = sanitizeSearchPattern(pattern);
    if (!sanitized) {
        return { result: text, error: 'Patrón vacío' };
    }
    try {
        const regex = new RegExp(sanitized, 'gi');
        return { result: text.replace(regex, '==$0==') };
    } catch {
        return { result: text, error: 'Patrón inválido' };
    }
}

export function findAllMatches(text: string, pattern: string): { result: string; error?: string } {
    const sanitized = sanitizeSearchPattern(pattern);
    if (!sanitized) {
        return { result: 'Sin coincidencias' };
    }
    try {
        const regex = new RegExp(sanitized, 'gi');
        const matches = text.match(regex);
        if (!matches) return { result: 'Sin coincidencias' };
        const counts: Record<string, number> = {};
        for (const match of matches) {
            counts[match] = (counts[match] || 0) + 1;
        }
        return {
            result: Object.entries(counts)
                .map(([match, count]) => `"${truncateText(match, 50)}": ${count}`)
                .join('\n')
        };
    } catch {
        return { result: 'Patrón inválido' };
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
        return { result: 0, error: 'Patrón inválido' };
    }
}

export function replaceAllMatches(text: string, pattern: string, replacement: string): { result: string; error?: string } {
    const sanitized = sanitizeRegexPattern(pattern);
    if (sanitized.error) {
        return { result: text, error: sanitized.error };
    }
    try {
        const regex = new RegExp(sanitized.safe, 'gi');
        return { result: text.replace(regex, replacement) };
    } catch {
        return { result: text, error: 'Patrón inválido' };
    }
}