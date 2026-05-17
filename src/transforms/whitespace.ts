export function cleanWhitespace(text: string): string {
    return text
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^[ \t]+/gm, '')
        .replace(/[ \t]+$/gm, '');
}