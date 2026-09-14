export function sortNatural(text: string): string {
    const lines = text.split('\n');
    return lines.sort(naturalCompare).join('\n');
}

export function sortNaturalDescending(text: string): string {
    const lines = text.split('\n');
    return lines.sort((a, b) => naturalCompare(b, a)).join('\n');
}

export function sortByLength(text: string): string {
    return text.split('\n').sort((a, b) => a.length - b.length || a.localeCompare(b)).join('\n');
}

export function sortByLengthDescending(text: string): string {
    return text.split('\n').sort((a, b) => b.length - a.length || a.localeCompare(b)).join('\n');
}

export function sortNumeric(text: string): string {
    return text.split('\n').sort((a, b) => {
        const na = parseFloat(a);
        const nb = parseFloat(b);
        if (isNaN(na) && isNaN(nb)) return a.localeCompare(b);
        if (isNaN(na)) return 1;
        if (isNaN(nb)) return -1;
        return na - nb;
    }).join('\n');
}

function tokenize(value: string): (string | number)[] {
    const tokens: (string | number)[] = [];
    value.replace(/(\d+)|(\D+)/g, (_, digits, text) => {
        tokens.push(digits ? parseInt(digits, 10) : text);
        return '';
    });
    return tokens;
}

function naturalCompare(a: string, b: string): number {
    const ax = tokenize(a);
    const bx = tokenize(b);
    const length = Math.min(ax.length, bx.length);
    for (let i = 0; i < length; i++) {
        const an = ax[i];
        const bn = bx[i];
        const typeDiff = (typeof an === 'number' ? 1 : 0) - (typeof bn === 'number' ? 1 : 0);
        if (typeDiff) return typeDiff;
        if (an < bn) return -1;
        if (an > bn) return 1;
    }
    return ax.length - bx.length;
}
