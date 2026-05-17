export function prettify(text: string): string {
    let formatted = '';
    let indent = 0;
    const lines = text.replace(/(>)(<)(\/?)/g, '$1\n$2$3').split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('</')) {
            indent = Math.max(0, indent - 1);
        }

        formatted += '  '.repeat(indent) + trimmed + '\n';

        if (trimmed.startsWith('<') && !trimmed.startsWith('</') &&
            !trimmed.startsWith('<!') && !trimmed.startsWith('<?') &&
            !trimmed.endsWith('/>')) {
            indent++;
        }
    }

    return formatted.trim();
}

export function minify(text: string): string {
    return text
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
}