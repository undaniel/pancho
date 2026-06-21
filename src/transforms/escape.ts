import { t } from '../utils/i18n';

export function escapeJSON(text: string): string {
    return JSON.stringify(text);
}

export function unescapeJSON(text: string): { result: string; error?: string } {
    try {
        const parsed = JSON.parse(text);
        if (typeof parsed !== 'string') {
            return { result: text, error: t('JSON is not a string') };
        }
        return { result: parsed };
    } catch {
        return { result: text, error: t('Invalid JSON') };
    }
}

export function escapeForSQL(text: string): string {
    return text.replace(/'/g, "''");
}

export function unescapeForSQL(text: string): string {
    return text.replace(/''/g, "'");
}

export function escapeForRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function escapeForHTML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function unescapeForHTML(text: string): { result: string; error?: string } {
    const invalidSequence = /&(?!(amp|lt|gt|quot|#39|#x27|#[0-9]+;|#[0-9a-fA-F]+;))/gi;
    if (invalidSequence.test(text)) {
        return { result: text, error: t('Invalid HTML sequence') };
    }
    return {
        result: text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'"),
        error: undefined
    };
}
