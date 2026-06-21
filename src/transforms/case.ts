export function toUpper(text: string): string {
    return text.toUpperCase();
}

export function toLower(text: string): string {
    return text.toLowerCase();
}

export function toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}