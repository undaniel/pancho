export function removeTrailingSpaces(text: string): string {
    return text.replace(/[ \t]+$/gm, '');
}

export function removeLeadingSpaces(text: string): string {
    return text.replace(/^[ \t]+/gm, '');
}

export function removeLeadingAndTrailingSpaces(text: string): string {
    return text.replace(/^[ \t]+/gm, '').replace(/[ \t]+$/gm, '');
}