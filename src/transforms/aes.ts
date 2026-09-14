import * as crypto from 'crypto';
import { t } from '../utils/i18n';

const V2_PREFIX = 'PANCHO-AES2:';
const V2_ALGORITHM = 'aes-256-gcm';
const V2_ITERATIONS = 210000;

const LEGACY_ALGORITHM = 'aes-256-cbc';
const LEGACY_SALT = 'pancho-static-salt-v1';
const LEGACY_ITERATIONS = 100000;

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const LEGACY_IV_LENGTH = 16;
const KEY_LENGTH = 32;

function deriveKey(password: string, salt: Buffer | string, iterations: number): Buffer {
    return crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, 'sha256');
}

export function aesEncrypt(text: string, password: string): { result: string; error?: string } {
    if (!password) return { result: text, error: t('Password required') };
    try {
        const salt = crypto.randomBytes(SALT_LENGTH);
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = deriveKey(password, salt, V2_ITERATIONS);
        const cipher = crypto.createCipheriv(V2_ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        const payload = Buffer.concat([salt, iv, tag, encrypted]);
        return { result: V2_PREFIX + payload.toString('base64') };
    } catch {
        return { result: text, error: t('Encryption failed') };
    }
}

export function aesDecrypt(text: string, password: string): { result: string; error?: string } {
    if (!password) return { result: text, error: t('Password required') };
    const trimmed = text.trim();
    try {
        if (trimmed.startsWith(V2_PREFIX)) {
            return decryptV2(trimmed.slice(V2_PREFIX.length), password, text);
        }
        return decryptLegacy(trimmed, password, text);
    } catch {
        return { result: text, error: t('Decryption failed (wrong password?)') };
    }
}

function decryptV2(encoded: string, password: string, fallbackText: string): { result: string; error?: string } {
    const payload = Buffer.from(encoded, 'base64');
    const minimum = SALT_LENGTH + IV_LENGTH + TAG_LENGTH;
    if (payload.length < minimum) {
        return { result: fallbackText, error: t('Invalid encrypted data') };
    }
    const salt = payload.subarray(0, SALT_LENGTH);
    const iv = payload.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = payload.subarray(SALT_LENGTH + IV_LENGTH, minimum);
    const data = payload.subarray(minimum);
    const key = deriveKey(password, salt, V2_ITERATIONS);
    const decipher = crypto.createDecipheriv(V2_ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return { result: decrypted.toString('utf-8') };
}

function decryptLegacy(trimmed: string, password: string, fallbackText: string): { result: string; error?: string } {
    const parts = trimmed.split(':');
    if (parts.length !== 2) {
        return { result: fallbackText, error: t('Invalid format (expected iv:encrypted)') };
    }
    const key = deriveKey(password, LEGACY_SALT, LEGACY_ITERATIONS);
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    if (iv.length !== LEGACY_IV_LENGTH) {
        return { result: fallbackText, error: t('Invalid format (expected iv:encrypted)') };
    }
    const decipher = crypto.createDecipheriv(LEGACY_ALGORITHM, key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return { result: decrypted.toString('utf-8') };
}
