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

export function sortLinesAscending(text: string): string {
    return text.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
}

export function sortLinesDescending(text: string): string {
    return text.split('\n').sort((a, b) => b.localeCompare(a)).join('\n');
}

export function reverseLines(text: string): string {
    return text.split('\n').reverse().join('\n');
}

export function joinLines(text: string, separator: string = ' '): string {
    return text.split('\n').map(line => line.trim()).filter(line => line).join(separator);
}

export function splitLine(text: string): string {
    return text.replace(/(.{1,80})(?=\s)/g, '$1\n');
}

export function moveLineUp(text: string, currentLineIndex: number = 0): string {
    if (currentLineIndex <= 0) return text;
    const lines = text.split('\n');
    if (currentLineIndex >= lines.length) return text;
    [lines[currentLineIndex], lines[currentLineIndex - 1]] = [lines[currentLineIndex - 1], lines[currentLineIndex]];
    return lines.join('\n');
}

export function moveLineDown(text: string, currentLineIndex: number = 0): string {
    const lines = text.split('\n');
    if (currentLineIndex < 0 || currentLineIndex >= lines.length - 1) return text;
    [lines[currentLineIndex], lines[currentLineIndex + 1]] = [lines[currentLineIndex + 1], lines[currentLineIndex]];
    return lines.join('\n');
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