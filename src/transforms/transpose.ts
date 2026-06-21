export function transposeCharacters(text: string): string {
    if (text.length < 2) return text;
    return text.slice(0, -2) + text.slice(-1) + text.slice(-2, -1);
}

export function transposeWords(text: string): string {
    const match = text.match(/^(\s*)(\S+)(\s+)(\S+)(\s*)$/);
    if (!match) return text;
    return match[1] + match[4] + match[3] + match[2] + match[5];
}

export function transposeLines(text: string): string {
    const lines = text.split('\n');
    if (lines.length < 2) return text;
    const tmp = lines[lines.length - 1];
    lines[lines.length - 1] = lines[lines.length - 2];
    lines[lines.length - 2] = tmp;
    return lines.join('\n');
}
