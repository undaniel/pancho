export function duplicateLine(text: string): string {
    return text.split('\n').map(line => line + '\n' + line).join('\n');
}

export function insertLineBefore(text: string, newLine: string = ''): string {
    const lines = text.split('\n');
    if (lines[0] && lines[0].trim()) {
        lines.unshift(newLine);
    }
    return lines.join('\n');
}

export function insertLineAfter(text: string, newLine: string = ''): string {
    const lines = text.split('\n');
    if (lines.length > 0 && lines[lines.length - 1].trim()) {
        lines.push(newLine);
    }
    return lines.join('\n');
}

export function deleteLinesContaining(text: string, pattern: string): string {
    return text.split('\n').filter(line => !line.includes(pattern)).join('\n');
}

export function keepOnlyLinesContaining(text: string, pattern: string): string {
    return text.split('\n').filter(line => line.includes(pattern)).join('\n');
}

export function deleteLinesMatchingRegex(text: string, regex: string): string {
    try {
        const re = new RegExp(regex, 'i');
        return text.split('\n').filter(line => !re.test(line)).join('\n');
    } catch {
        return text;
    }
}

export function keepOnlyLinesMatchingRegex(text: string, regex: string): string {
    try {
        const re = new RegExp(regex, 'i');
        return text.split('\n').filter(line => re.test(line)).join('\n');
    } catch {
        return text;
    }
}