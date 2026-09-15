import { parseColor } from './colorInfo';
import { tryDecodeBase64 } from './hoverInfo';

export type ContentKind = 'jwt' | 'json' | 'csv' | 'color' | 'base64' | 'timestamp';

const JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

function delimiterColumns(line: string, delimiter: string): number {
    return line.split(delimiter).length - 1;
}

function looksLikeDelimited(text: string): boolean {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return false;
    for (const delimiter of [',', '\t', ';']) {
        const first = delimiterColumns(lines[0], delimiter);
        if (first < 1) continue;
        const consistent = lines.slice(0, 5).every(line => delimiterColumns(line, delimiter) === first);
        if (consistent) return true;
    }
    return false;
}

export function detectContent(rawText: string): ContentKind[] {
    const text = rawText.trim();
    if (!text || text.length > 5_000_000) return [];

    const kinds: ContentKind[] = [];

    if (JWT_SHAPE.test(text)) kinds.push('jwt');

    if (/^\d{10}$|^\d{13}$/.test(text)) kinds.push('timestamp');

    if (parseColor(text)) kinds.push('color');

    if (text[0] === '{' || text[0] === '[') {
        try {
            JSON.parse(text);
            kinds.push('json');
        } catch {
            // not JSON
        }
    }

    if (looksLikeDelimited(text)) kinds.push('csv');

    if (tryDecodeBase64(text) !== null) kinds.push('base64');

    return kinds;
}
