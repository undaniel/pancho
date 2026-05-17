export function minifyJSON(text: string): string {
    try {
        return JSON.stringify(JSON.parse(text));
    } catch {
        return text;
    }
}

export function prettifyJSON(text: string, indent: number = 2): string {
    try {
        return JSON.stringify(JSON.parse(text), null, indent);
    } catch {
        return text;
    }
}

export function minifyHTML(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s*<\s*/g, '<')
        .replace(/\s*>\s*/g, '>')
        .replace(/\s+class\s*=/g, ' class=')
        .replace(/\s+id\s*=/g, ' id=')
        .trim();
}

export function prettifyHTML(text: string): string {
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

export function minifyCSS(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/;\s*}/g, '}')
        .trim();
}

export function prettifyCSS(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/\n\s+\n/g, '\n')
        .trim();
}

export function minifyJS(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .trim();
}

export function prettifyJS(text: string): string {
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

export function htmlEntitiesEncode(text: string): string {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, char => entities[char as keyof typeof entities]);
}

export function htmlEntitiesDecode(text: string): string {
    const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return text.replace(/&(amp|lt|gt|quot|#39);/g, entity => entities[entity as keyof typeof entities] || entity);
}

export function base64Encode(text: string): string {
    return Buffer.from(text, 'utf-8').toString('base64');
}

export function base64Decode(text: string): string {
    return Buffer.from(text, 'base64').toString('utf-8');
}

export function urlEncode(text: string): string {
    return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
    return decodeURIComponent(text);
}

export function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(rgb: string): string {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(rgb);
    if (!result) return rgb;
    const r = parseInt(result[1]);
    const g = parseInt(result[2]);
    const b = parseInt(result[3]);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function generateLoremIpsum(words: number = 50): string {
    const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';
    return Array(words).fill(lorem.split(' ')).flat().slice(0, words).join(' ');
}