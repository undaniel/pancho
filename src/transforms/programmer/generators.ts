import { getRandomValues, randomUUID } from '../../utils/webcrypto';

export const MAX_RANDOM_STRING_LENGTH = 10000;

function randomBytes(length: number): Uint8Array {
    return getRandomValues(new Uint8Array(length));
}

export function generateUUID(): string {
    return randomUUID();
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
