export function minify(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s*<\s*/g, '<')
        .replace(/\s*>\s*/g, '>')
        .replace(/\s+class\s*=/g, ' class=')
        .replace(/\s+id\s*=/g, ' id=')
        .trim();
}

export function prettify(text: string): string {
    let formatted = '';
    let indent = 0;
    const lines = text.replace(/></g, '>\n<').split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('</')) {
            indent = Math.max(0, indent - 1);
        }

        formatted += '  '.repeat(indent) + trimmed + '\n';

        if (trimmed.startsWith('<') && !trimmed.startsWith('</') &&
            !trimmed.startsWith('<!') && !trimmed.startsWith('<?') &&
            !trimmed.endsWith('/>') && !trimmed.startsWith('</')) {
            indent++;
        }
    }

    return formatted.trim();
}