export function sanitizeSearchPattern(pattern: string): string {
    if (!pattern) return '';
    return pattern
        .replace(/<[^>]*>/g, '')
        .slice(0, 1000);
}
