export function toWindowsEOL(text: string): string {
    return text.replace(/\r?\n|\r/g, '\r\n');
}

export function toUnixEOL(text: string): string {
    return text.replace(/\r?\n|\r/g, '\n');
}

export function toMacEOL(text: string): string {
    return text.replace(/\r?\n|\r/g, '\r');
}