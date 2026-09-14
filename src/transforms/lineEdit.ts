import { sanitizeSearchPattern } from '../utils/sanitize';

export function deleteLinesContaining(text: string, pattern: string): string {
    const sanitized = sanitizeSearchPattern(pattern);
    return text.split('\n').filter(line => !line.includes(sanitized)).join('\n');
}

export function keepOnlyLinesContaining(text: string, pattern: string): string {
    const sanitized = sanitizeSearchPattern(pattern);
    return text.split('\n').filter(line => line.includes(sanitized)).join('\n');
}