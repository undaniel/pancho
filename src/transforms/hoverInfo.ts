import { t } from '../utils/i18n';
import { decodeJWT } from './jwt';
import { parseColor } from './colorInfo';
import { timestampToISO } from './timestamp';

export interface HoverCandidate {
    token: string;
    start: number;
    end: number;
}

export interface HoverInfo {
    kind: 'jwt' | 'timestamp' | 'color' | 'base64';
    title: string;
    lines: string[];
}

const JWT_RE = /[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g;
const COLOR_HEX_RE = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g;
const COLOR_RGB_RE = /rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/gi;
const TIMESTAMP_RE = /\b\d{10}\b|\b\d{13}\b/g;
const BASE64_RE = /\b[A-Za-z0-9+/]{12,}={0,2}(?![A-Za-z0-9+/=])/g;

const PATTERNS: { re: RegExp; kind: HoverInfo['kind'] }[] = [
    { re: JWT_RE, kind: 'jwt' },
    { re: COLOR_HEX_RE, kind: 'color' },
    { re: COLOR_RGB_RE, kind: 'color' },
    { re: TIMESTAMP_RE, kind: 'timestamp' },
    { re: BASE64_RE, kind: 'base64' },
];

export function findHoverCandidate(line: string, character: number): HoverCandidate | null {
    for (const { re } of PATTERNS) {
        re.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = re.exec(line)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            if (character >= start && character <= end) {
                return { token: match[0], start, end };
            }
            if (match.index === re.lastIndex) re.lastIndex++;
        }
    }
    return null;
}

export function tryDecodeBase64(token: string): string | null {
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(token)) return null;
    if (token.length % 4 === 1) return null;
    try {
        const normalized = token.replace(/-/g, '+').replace(/_/g, '/');
        const buffer = Buffer.from(normalized, 'base64');
        if (buffer.length === 0) return null;
        const text = buffer.toString('utf-8');
        if (text.length === 0) return null;
        if (text.includes('\uFFFD')) return null;
        let printable = 0;
        for (const char of text) {
            const code = char.codePointAt(0) ?? 0;
            if (code >= 32 || char === '\n' || char === '\r' || char === '\t') printable++;
        }
        if (printable / text.length < 0.9) return null;
        if (!/\s|[^\w]/.test(text)) return null;
        return text;
    } catch {
        return null;
    }
}

const JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export function buildHover(token: string): HoverInfo | null {
    if (JWT_SHAPE.test(token)) {
        const decoded = decodeJWT(token);
        if (!decoded.error) {
            return { kind: 'jwt', title: t('Decoded JWT'), lines: decoded.result.split('\n') };
        }
    }

    const color = parseColor(token);
    if (color) {
        const { hex, rgb, hsl } = color;
        return {
            kind: 'color',
            title: t('Color'),
            lines: [
                `HEX: ${hex}`,
                `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                `HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
            ],
        };
    }

    if (/^\d{10}$|^\d{13}$/.test(token)) {
        const iso = timestampToISO(token);
        if (!iso.error) {
            return { kind: 'timestamp', title: t('Timestamp'), lines: iso.result.split('\n') };
        }
    }

    const decoded = tryDecodeBase64(token);
    if (decoded !== null) {
        return { kind: 'base64', title: t('Decoded Base64'), lines: decoded.split('\n').slice(0, 50) };
    }

    return null;
}
