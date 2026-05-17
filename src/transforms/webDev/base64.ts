export function encode(text: string): { result: string } {
    return { result: Buffer.from(text, 'utf-8').toString('base64') };
}

export function decode(text: string): { result: string; error?: string } {
    try {
        const decoded = Buffer.from(text.trim(), 'base64').toString('utf-8');
        if (text.trim() !== Buffer.from(decoded, 'utf-8').toString('base64')) {
            return { result: decoded, error: 'Base64 potencialmente inválido' };
        }
        return { result: decoded };
    } catch {
        return { result: text, error: 'Base64 inválido' };
    }
}