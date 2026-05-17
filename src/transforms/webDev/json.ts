export function minify(text: string): { result: string; error?: string } {
    try {
        return { result: JSON.stringify(JSON.parse(text)) };
    } catch (e) {
        return { result: text, error: 'JSON inválido' };
    }
}

export function prettify(text: string, indent: number = 2): { result: string; error?: string } {
    try {
        return { result: JSON.stringify(JSON.parse(text), null, indent) };
    } catch (e) {
        return { result: text, error: 'JSON inválido' };
    }
}