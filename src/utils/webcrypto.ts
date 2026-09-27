/**
 * Portable WebCrypto access.
 *
 * The web extension host (and recent Node/Electron) expose `globalThis.crypto`,
 * but the Node extension host of older VS Code (e.g. 1.80, which ships Node 16)
 * does not — there WebCrypto and the CSPRNG only exist behind `node:crypto`.
 * This module hides that difference.
 *
 * The lazy `require('node:crypto')` is marked external in the web bundle (see
 * `esbuild.config.mjs`); it is only reached when `globalThis.crypto` is absent,
 * which never happens in a browser.
 */

interface WebCryptoLike {
    getRandomValues?: (array: Uint8Array) => Uint8Array;
    randomUUID?: () => string;
    subtle?: SubtleCrypto;
}

interface NodeCryptoLike {
    randomFillSync?: (buffer: Uint8Array) => Uint8Array;
    randomUUID?: () => string;
    webcrypto?: WebCryptoLike;
}

function webCrypto(): WebCryptoLike | undefined {
    return (globalThis as { crypto?: WebCryptoLike }).crypto;
}

let nodeCryptoCache: NodeCryptoLike | null | undefined;

function nodeCrypto(): NodeCryptoLike | null {
    if (nodeCryptoCache === undefined) {
        try {
            nodeCryptoCache = require('node:crypto') as NodeCryptoLike;
        } catch {
            nodeCryptoCache = null;
        }
    }
    return nodeCryptoCache;
}

/** WebCrypto's `subtle`, or `undefined` when no implementation is available. */
export function getSubtle(): SubtleCrypto | undefined {
    return webCrypto()?.subtle ?? nodeCrypto()?.webcrypto?.subtle;
}

type Fill = (bytes: Uint8Array) => void;
let fillCache: Fill | null | undefined;

function resolveFill(): Fill | null {
    if (fillCache !== undefined) return fillCache;

    const web = webCrypto();
    if (web?.getRandomValues) {
        fillCache = bytes => { web.getRandomValues!(bytes); };
        return fillCache;
    }

    const node = nodeCrypto();
    if (node?.webcrypto?.getRandomValues) {
        fillCache = bytes => { node.webcrypto!.getRandomValues!(bytes); };
        return fillCache;
    }
    if (node?.randomFillSync) {
        fillCache = bytes => { node.randomFillSync!(bytes); };
        return fillCache;
    }

    fillCache = null;
    return null;
}

/** Fills `bytes` with cryptographically-strong random data. Throws if unavailable. */
export function getRandomValues(bytes: Uint8Array): Uint8Array {
    const fill = resolveFill();
    if (!fill) throw new Error('No secure random source available');
    fill(bytes);
    return bytes;
}

/** RFC 4122 version 4 UUID. */
export function randomUUID(): string {
    const web = webCrypto();
    if (typeof web?.randomUUID === 'function') return web.randomUUID();

    const node = nodeCrypto();
    if (typeof node?.randomUUID === 'function') return node.randomUUID();

    const bytes = getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
