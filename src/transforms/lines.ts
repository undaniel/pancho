export function removeDuplicateLines(text: string): string {
    const lines = text.split('\n');
    const seen = new Set();
    const result = lines.filter(line => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
    });
    return result.join('\n');
}

export function removeConsecutiveDuplicateLines(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    for (const line of lines) {
        if (result.length === 0 || result[result.length - 1] !== line) {
            result.push(line);
        }
    }
    return result.join('\n');
}

export function reverseLines(text: string): string {
    return text.split('\n').reverse().join('\n');
}

export function removeEmptyLines(text: string): string {
    return text.split('\n').filter(line => line.trim() !== '').join('\n');
}

export function removeLinesContaining(text: string, pattern: string): string {
    return text.split('\n').filter(line => !line.includes(pattern)).join('\n');
}

export function removeAllSpaces(text: string): string {
    return text.replace(/\s/g, '');
}