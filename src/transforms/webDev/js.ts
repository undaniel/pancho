export function minify(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .trim();
}

export function prettify(text: string): string {
    let formatted = '';
    let indent = 0;
    const tokens = text
        .replace(/({|})/g, ' $1 ')
        .split(/(\s+)/)
        .filter(t => t.trim());

    for (const token of tokens) {
        if (token === '{') {
            formatted += ' {\n' + '  '.repeat(++indent);
        } else if (token === '}') {
            formatted = formatted.trim() + '\n' + '  '.repeat(--indent) + '}';
        } else if (token === ';') {
            formatted += ';\n' + '  '.repeat(indent);
        } else {
            formatted += token + ' ';
        }
    }

    return formatted.trim();
}