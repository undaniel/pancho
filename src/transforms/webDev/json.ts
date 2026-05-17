export function minify(text: string): string {
    try {
        return JSON.stringify(JSON.parse(text));
    } catch {
        return text;
    }
}

export function prettify(text: string, indent: number = 2): string {
    try {
        return JSON.stringify(JSON.parse(text), null, indent);
    } catch {
        return text;
    }
}