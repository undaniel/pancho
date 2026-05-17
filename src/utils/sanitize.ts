export function sanitizeRegexPattern(pattern: string): { safe: string; error?: string } {
    if (!pattern || pattern.length === 0) {
        return { safe: '', error: 'Patrón vacío' };
    }

    if (pattern.length > 500) {
        return { safe: '', error: 'Patrón demasiado largo' };
    }

    const forbidden = /<[^>]*>/g;
    if (forbidden.test(pattern)) {
        return { safe: '', error: 'Patrón contiene HTML inválido' };
    }

    try {
        new RegExp(pattern);
        return { safe: pattern };
    } catch {
        return { safe: '', error: 'Patrón de regex inválido' };
    }
}

export function sanitizeSearchPattern(pattern: string): string {
    if (!pattern) return '';
    return pattern
        .replace(/<[^>]*>/g, '')
        .slice(0, 1000);
}

export function sanitizeFilePath(path: string): string {
    if (!path) return '';
    return path.replace(/[<>:"|?*]/g, '').slice(0, 255);
}

export function isSafeText(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    if (text.length > 10 * 1024 * 1024) return false;
    return true;
}

export function truncateText(text: string, maxLength: number = 10000): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}