export function toUpper(text: string): string {
    return text.toUpperCase();
}

export function toLower(text: string): string {
    return text.toLowerCase();
}

export function toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function toSentenceCase(text: string): string {
    return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
}

export function invertCase(text: string): string {
    return text.replace(/\w/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
}

export function randomCase(text: string): string {
    return text.replace(/\w/g, c => Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase());
}

export function toKebabCase(text: string): string {
    return text
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}

export function toSnakeCase(text: string): string {
    return text
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
}

export function toCamelCase(text: string): string {
    const normalized = text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[\s\-_]+/g, ' ').trim();
    const words = normalized.split(' ');
    return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toPascalCase(text: string): string {
    const camel = toCamelCase(text);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function toConstantCase(text: string): string {
    return toSnakeCase(text).toUpperCase();
}
