const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

const reverseEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
};

export function encode(text: string): string {
    return text.replace(/[&<>"']/g, char => entities[char] || char);
}

export function decode(text: string): string {
    return text.replace(/&(amp|lt|gt|quot|#39);/g, entity => reverseEntities[entity] || entity);
}