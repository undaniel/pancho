export function simpleDiff(text: string): string {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        const num = String(i + 1).padStart(3, ' ');
        return `${num} | ${line}`;
    }).join('\n');
}

export function hashMD5(text: string): string {
    return require('crypto').createHash('md5').update(text).digest('hex');
}

export function hashSHA1(text: string): string {
    return require('crypto').createHash('sha1').update(text).digest('hex');
}

export function hashSHA256(text: string): string {
    return require('crypto').createHash('sha256').update(text).digest('hex');
}

export function hashSHA512(text: string): string {
    return require('crypto').createHash('sha512').update(text).digest('hex');
}

export function formatSQL(text: string): string {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'];

    let formatted = text;
    for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, '\n' + keyword);
    }

    formatted = formatted
        .replace(/,\s*/g, ',\n  ')
        .replace(/\s+/g, ' ')
        .trim();

    return formatted.replace(/^\n/, '');
}

export function prettifyXML(text: string): string {
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

export function minifyXML(text: string): string {
    return text
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function generateRandomString(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array(length).fill(chars).map((c, i) => c[Math.floor(Math.random() * c.length)]).join('');
}

export function escapeJSON(text: string): string {
    return JSON.stringify(text);
}

export function unescapeJSON(text: string): string {
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export function toBinary(text: string): string {
    return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

export function fromBinary(binary: string): string {
    return binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

export function toOctal(text: string): string {
    return text.split('').map(c => c.charCodeAt(0).toString(8)).join(' ');
}

export function fromOctal(octal: string): string {
    return octal.split(' ').map(o => String.fromCharCode(parseInt(o, 8))).join('');
}

export function toHex(text: string): string {
    return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

export function fromHex(hex: string): string {
    return hex.split(/([a-fA-F0-9]{2})/).filter(Boolean).map(h => String.fromCharCode(parseInt(h, 16))).join('');
}