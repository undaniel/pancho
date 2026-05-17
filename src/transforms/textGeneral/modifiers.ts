export function removeDuplicateWords(text: string): string {
    const words = text.split(/\s+/);
    const seen = new Set();
    return words.filter(word => {
        const lower = word.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
    }).join(' ');
}

export function numberLines(text: string, start: number = 1): string {
    const lines = text.split('\n');
    return lines.map((line, i) => `${start + i}: ${line}`).join('\n');
}

export function removeLineNumbers(text: string): string {
    return text.replace(/^\d+:\s*/gm, '');
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function reverseWords(text: string): string {
    return text.split(/\s+/).reverse().join(' ');
}

export function randomizeLines(text: string): string {
    const lines = text.split('\n');
    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    return lines.join('\n');
}