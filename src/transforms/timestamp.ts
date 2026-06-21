export function timestampToISO(text: string): { result: string; error?: string } {
    const trimmed = text.trim();
    const ts = Number(trimmed);
    if (isNaN(ts)) return { result: text, error: 'Not a number' };

    // Heuristic: if length is 10, treat as seconds; if 13, milliseconds
    const ms = trimmed.length <= 10 ? ts * 1000 : ts;
    try {
        const date = new Date(ms);
        if (isNaN(date.getTime())) return { result: text, error: 'Invalid timestamp' };
        return { result: `${date.toISOString()} (${date.toLocaleString()})` };
    } catch {
        return { result: text, error: 'Invalid timestamp' };
    }
}

export function isoToTimestamp(text: string): { result: string; error?: string } {
    const trimmed = text.trim();
    try {
        const date = new Date(trimmed);
        if (isNaN(date.getTime())) return { result: text, error: 'Invalid ISO date' };
        return { result: `${Math.floor(date.getTime() / 1000)} (s) | ${date.getTime()} (ms)` };
    } catch {
        return { result: text, error: 'Invalid ISO date' };
    }
}

export function nowAsTimestamp(): string {
    const ms = Date.now();
    return `${Math.floor(ms / 1000)} (s) | ${ms} (ms) | ${new Date(ms).toISOString()}`;
}
