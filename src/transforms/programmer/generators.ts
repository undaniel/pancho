export const MAX_RANDOM_STRING_LENGTH = 10000;

function randomBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
}

export function generateUUID(): string {
    if (typeof globalThis.crypto.randomUUID === 'function') {
        return globalThis.crypto.randomUUID();
    }
    const bytes = randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateRandomString(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const safeLength = Number.isFinite(length)
        ? Math.min(MAX_RANDOM_STRING_LENGTH, Math.max(1, Math.floor(length)))
        : 16;
    const bytes = randomBytes(safeLength);
    let result = '';
    for (let i = 0; i < safeLength; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}
