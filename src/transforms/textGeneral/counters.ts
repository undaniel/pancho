export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export function countCharacters(text: string): number {
    return text.length;
}

export function countLines(text: string): number {
    return text.split('\n').length;
}