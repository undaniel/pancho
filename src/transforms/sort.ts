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

function naturalCompare(a: string, b: string): number {
    const ax: (string | number)[] = [];
    const bx: (string | number)[] = [];
    a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push($1 ? parseInt($1, 10) : $2); return ''; });
    b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push($1 ? parseInt($1, 10) : $2); return ''; });
    while (ax.length && bx.length) {
        const an = ax.shift()!;
        const bn = bx.shift()!;
        const nn = (typeof an === 'number' ? 1 : 0) - (typeof bn === 'number' ? 1 : 0);
        if (nn) return nn;
        if (an < bn) return -1;
        if (an > bn) return 1;
    }
    return ax.length - bx.length;
}
