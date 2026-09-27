import { t } from '../utils/i18n';
import { utf8Encode, utf8Decode, bytesToBase64, base64ToBytes, hexToBytes, concatBytes, bufferSource } from '../utils/bytes';
import { getRandomValues, getSubtle } from '../utils/webcrypto';

const V2_PREFIX = 'PANCHO-AES2:';
const V2_ITERATIONS = 210000;

const LEGACY_SALT = 'pancho-static-salt-v1';
const LEGACY_ITERATIONS = 100000;

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const LEGACY_IV_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * AES via WebCrypto so it works on the desktop and on the web. The v2 wire
 * format stays `salt | iv | tag | ciphertext` (Base64) and legacy CBC payloads
 * (`ivHex:ciphertextHex`) remain decryptable.
 */

function subtle(): SubtleCrypto {
    const value = getSubtle();
    if (!value) throw new Error('WebCrypto is not available');
    return value;
}

function randomBytes(length: number): Uint8Array {
    return getRandomValues(new Uint8Array(length));
}

async function deriveGcmKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const base = await subtle().importKey('raw', bufferSource(utf8Encode(password)), 'PBKDF2', false, ['deriveKey']);
    return subtle().deriveKey(
        { name: 'PBKDF2', salt: bufferSource(salt), iterations: V2_ITERATIONS, hash: 'SHA-256' },
        base,
        { name: 'AES-GCM', length: KEY_LENGTH * 8 },
        false,
        ['encrypt', 'decrypt'],
    );
}

async function deriveBits(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
    const base = await subtle().importKey('raw', bufferSource(utf8Encode(password)), 'PBKDF2', false, ['deriveBits']);
    return subtle().deriveBits(
        { name: 'PBKDF2', salt: bufferSource(salt), iterations, hash: 'SHA-256' },
        base,
        KEY_LENGTH * 8,
    );
}

export async function aesEncrypt(text: string, password: string): Promise<{ result: string; error?: string }> {
    if (!password) return { result: text, error: t('Password required') };
    try {
        const salt = randomBytes(SALT_LENGTH);
        const iv = randomBytes(IV_LENGTH);
        const key = await deriveGcmKey(password, salt);
        const raw = new Uint8Array(await subtle().encrypt({ name: 'AES-GCM', iv: bufferSource(iv) }, key, bufferSource(utf8Encode(text))));
        const tag = raw.slice(raw.length - TAG_LENGTH);
        const ciphertext = raw.slice(0, raw.length - TAG_LENGTH);
        const payload = concatBytes(salt, iv, tag, ciphertext);
        return { result: V2_PREFIX + bytesToBase64(payload) };
    } catch {
        return { result: text, error: t('Encryption failed') };
    }
}

export async function aesDecrypt(text: string, password: string): Promise<{ result: string; error?: string }> {
    if (!password) return { result: text, error: t('Password required') };
    const trimmed = text.trim();
    try {
        if (trimmed.startsWith(V2_PREFIX)) {
            return await decryptV2(trimmed.slice(V2_PREFIX.length), password, text);
        }
        return await decryptLegacy(trimmed, password, text);
    } catch {
        return { result: text, error: t('Decryption failed (wrong password?)') };
    }
}

async function decryptV2(encoded: string, password: string, fallbackText: string): Promise<{ result: string; error?: string }> {
    const payload = base64ToBytes(encoded);
    const minimum = SALT_LENGTH + IV_LENGTH + TAG_LENGTH;
    if (payload.length < minimum) {
        return { result: fallbackText, error: t('Invalid encrypted data') };
    }
    const salt = payload.subarray(0, SALT_LENGTH);
    const iv = payload.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = payload.subarray(SALT_LENGTH + IV_LENGTH, minimum);
    const data = payload.subarray(minimum);
    const key = await deriveGcmKey(password, salt);
    const decrypted = await subtle().decrypt({ name: 'AES-GCM', iv: bufferSource(iv) }, key, bufferSource(concatBytes(data, tag)));
    return { result: utf8Decode(new Uint8Array(decrypted)) };
}

async function decryptLegacy(trimmed: string, password: string, fallbackText: string): Promise<{ result: string; error?: string }> {
    const parts = trimmed.split(':');
    if (parts.length !== 2) {
        return { result: fallbackText, error: t('Invalid format (expected iv:encrypted)') };
    }
    const iv = hexToBytes(parts[0]);
    const encrypted = hexToBytes(parts[1]);
    if (iv.length !== LEGACY_IV_LENGTH) {
        return { result: fallbackText, error: t('Invalid format (expected iv:encrypted)') };
    }
    const bits = await deriveBits(password, utf8Encode(LEGACY_SALT), LEGACY_ITERATIONS);
    const key = await subtle().importKey('raw', bits, { name: 'AES-CBC' }, false, ['decrypt']);
    const decrypted = await subtle().decrypt({ name: 'AES-CBC', iv: bufferSource(iv) }, key, bufferSource(encrypted));
    return { result: utf8Decode(new Uint8Array(decrypted)) };
}
