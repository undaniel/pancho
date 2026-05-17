export function minify(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/;\s*}/g, '}')
        .trim();
}

export function prettify(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/\n\s+\n/g, '\n')
        .trim();
}
