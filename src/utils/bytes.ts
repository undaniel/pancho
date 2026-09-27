/**
 * Portable byte helpers that work both on Node and in the browser (VS Code for
 * the Web). They intentionally avoid Node's `Buffer` so the extension can be
 * bundled for the web extension host.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

export function utf8Encode(text: string): Uint8Array {
    return encoder.encode(text);
}

export function utf8Decode(bytes: Uint8Array): string {
    return decoder.decode(bytes);
}

export function byteLength(text: string): number {
    return encoder.encode(text).length;
}

export function bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
    let hex = '';
    for (const byte of bytes) {
        hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
}

export function hexToBytes(hex: string): Uint8Array {
    const normalized = hex.length % 2 === 0 ? hex : `0${hex}`;
    const bytes = new Uint8Array(normalized.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
        result.set(part, offset);
        offset += part.length;
    }
    return result;
}

// Convenience UTF-8 <-> base64/hex conversions matching the old Buffer calls.
export function utf8ToBase64(text: string): string {
    return bytesToBase64(utf8Encode(text));
}

export function base64ToUtf8(base64: string): string {
    return utf8Decode(base64ToBytes(base64));
}

export function utf8ToHex(text: string): string {
    return bytesToHex(utf8Encode(text));
}

export function hexToUtf8(hex: string): string {
    return utf8Decode(hexToBytes(hex));
}

/**
 * Cast helper for WebCrypto calls: the DOM types reject views whose buffer is
 * typed as `ArrayBufferLike` (which may be a SharedArrayBuffer).
 */
export function bufferSource(bytes: Uint8Array): BufferSource {
    return bytes as unknown as BufferSource;
}
