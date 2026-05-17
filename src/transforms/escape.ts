export function escapeJSON(text: string): string {
    return JSON.stringify(text);
}

export function unescapeJSON(text: string): string {
    try {
        return JSON.parse(text);
    } catch {
        return text;
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

export function unescapeForHTML(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

export function escapeForShell(text: string): string {
    return text.replace(/[`$!"\\]/g, '\\$&');
}