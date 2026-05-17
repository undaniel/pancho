export function highlightMatches(text: string, pattern: string): string {
    try {
        const regex = new RegExp(pattern, 'gi');
        return text.replace(regex, '==$0==');
    } catch {
        return text;
    }
}

export function findAllMatches(text: string, pattern: string): string {
    try {
        const regex = new RegExp(pattern, 'gi');
        const matches = text.match(regex);
        if (!matches) return 'Sin coincidencias';
        const counts: Record<string, number> = {};
        for (const match of matches) {
            counts[match] = (counts[match] || 0) + 1;
        }
        return Object.entries(counts)
            .map(([match, count]) => `"${match}": ${count}`)
            .join('\n');
    } catch {
        return 'Patrón inválido';
    }
}

export function countMatches(text: string, pattern: string): number {
    try {
        const regex = new RegExp(pattern, 'gi');
        const matches = text.match(regex);
        return matches ? matches.length : 0;
    } catch {
        return 0;
    }
}

export function replaceAllMatches(text: string, pattern: string, replacement: string): string {
    try {
        const regex = new RegExp(pattern, 'gi');
        return text.replace(regex, replacement);
    } catch {
        return text;
    }
}