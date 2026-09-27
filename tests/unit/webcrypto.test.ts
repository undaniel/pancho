import { describe, it, expect, jest } from '@jest/globals';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

type WebCryptoModule = {
    getSubtle(): SubtleCrypto | undefined;
    getRandomValues(bytes: Uint8Array): Uint8Array;
    randomUUID(): string;
};

function freshModule(): WebCryptoModule {
    let mod: WebCryptoModule | undefined;
    jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        mod = require('../../src/utils/webcrypto') as WebCryptoModule;
    });
    return mod!;
}

describe('portable webcrypto', () => {
    it('generates v4 UUIDs', () => {
        const { randomUUID } = freshModule();
        expect(randomUUID()).toMatch(UUID_V4);
        expect(randomUUID()).not.toBe(randomUUID());
    });

    it('fills buffers with random bytes', () => {
        const { getRandomValues } = freshModule();
        const a = getRandomValues(new Uint8Array(32));
        const b = getRandomValues(new Uint8Array(32));
        expect(a).toHaveLength(32);
        expect(Array.from(a)).not.toEqual(Array.from(b));
    });

    it('exposes a WebCrypto subtle', () => {
        expect(freshModule().getSubtle()).toBeDefined();
    });

    // VS Code 1.80 runs on Node 16, where `globalThis.crypto` does not exist;
    // the module must fall back to `node:crypto` so AES and UUID keep working.
    it('falls back to node:crypto without globalThis.crypto', () => {
        const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
        delete (globalThis as { crypto?: unknown }).crypto;
        try {
            const { randomUUID, getRandomValues, getSubtle } = freshModule();
            expect(randomUUID()).toMatch(UUID_V4);
            expect(Array.from(getRandomValues(new Uint8Array(8)))).toHaveLength(8);
            expect(getSubtle()).toBeDefined();
        } finally {
            if (original) Object.defineProperty(globalThis, 'crypto', original);
        }
    });
});
