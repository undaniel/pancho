import * as crypto from 'crypto';

export const MAX_RANDOM_STRING_LENGTH = 10000;

export function generateUUID(): string {
    return crypto.randomUUID();
}

export function generateRandomString(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const safeLength = Number.isFinite(length)
        ? Math.min(MAX_RANDOM_STRING_LENGTH, Math.max(1, Math.floor(length)))
        : 16;
    const bytes = crypto.randomBytes(safeLength);
    let result = '';
    for (let i = 0; i < safeLength; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}
