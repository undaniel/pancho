import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SALT = 'pancho-static-salt-v1';
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

function deriveKey(password: string): Buffer {
    return crypto.pbkdf2Sync(password, SALT, ITERATIONS, KEY_LENGTH, 'sha256');
}

export function aesEncrypt(text: string, password: string): { result: string; error?: string } {
    if (!password) return { result: text, error: 'Password required' };
    try {
        const key = deriveKey(password);
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
        return { result: iv.toString('hex') + ':' + encrypted.toString('hex') };
    } catch (e) {
        return { result: text, error: 'Encryption failed' };
    }
}

export function aesDecrypt(text: string, password: string): { result: string; error?: string } {
    if (!password) return { result: text, error: 'Password required' };
    try {
        const parts = text.trim().split(':');
        if (parts.length !== 2) return { result: text, error: 'Invalid format (expected iv:encrypted)' };
        const key = deriveKey(password);
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = Buffer.from(parts[1], 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return { result: decrypted.toString('utf-8') };
    } catch (e) {
        return { result: text, error: 'Decryption failed (wrong password?)' };
    }
}
