export function alignByChar(text: string, char: string): { result: string; error?: string } {
    if (!char) return { result: text, error: 'Character is required' };
    const lines = text.split('\n').filter(l => l.length > 0);
    if (lines.length < 2) return { result: text };

    const positions: { line: string; idx: number }[] = lines.map(l => {
        const idx = l.indexOf(char);
        return { line: l, idx };
    });

    const validLines = positions.filter(p => p.idx !== -1);
    if (validLines.length === 0) return { result: text };

    const maxIdx = Math.max(...validLines.map(p => p.idx));

    const aligned = positions.map(p => {
        if (p.idx === -1) return p.line;
        const before = p.line.slice(0, p.idx);
        const after = p.line.slice(p.idx);
        return before + ' '.repeat(maxIdx - before.length) + after;
    });

    return { result: aligned.join('\n') };
}

export function alignEquals(text: string): { result: string; error?: string } {
    return alignByChar(text, '=');
}

export function alignColons(text: string): { result: string; error?: string } {
    return alignByChar(text, ':');
}
