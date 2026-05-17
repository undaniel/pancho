export function cleanLineEndings(text: string): string {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export function lineEndingsToSpaces(text: string): string {
    return text.replace(/\r?\n|\r/g, ' ');
}