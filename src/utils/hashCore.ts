import { utf8Encode } from './bytes';

/**
 * Dependency-free MD5 and SHA-256 so hashing works on the desktop and on the
 * web (WebCrypto has no MD5 and its digest API is async). Both return lowercase
 * hex and are verified against Node's `crypto` in the unit tests.
 */

function rotl32(value: number, bits: number): number {
    return (value << bits) | (value >>> (32 - bits));
}

function rotr32(value: number, bits: number): number {
    return (value >>> bits) | (value << (32 - bits));
}

// MD5 per-round constants: floor(abs(sin(i + 1)) * 2^32).
const MD5_K = Array.from({ length: 64 }, (_unused, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) | 0);

const MD5_S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

function littleEndianHex(word: number): string {
    let hex = '';
    for (let i = 0; i < 4; i++) {
        hex += ((word >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
}

export function md5Hex(input: string): string {
    const bytes = utf8Encode(input);
    const words = (((bytes.length + 8) >> 6) + 1) * 16;
    const buffer = new Uint32Array(words);
    for (let i = 0; i < bytes.length; i++) {
        buffer[i >> 2] |= bytes[i] << ((i % 4) * 8);
    }
    buffer[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
    const bits = bytes.length * 8;
    buffer[words - 2] = bits >>> 0;
    buffer[words - 1] = Math.floor(bits / 0x100000000);

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let chunk = 0; chunk < words; chunk += 16) {
        let a = a0;
        let b = b0;
        let c = c0;
        let d = d0;
        for (let i = 0; i < 64; i++) {
            let f: number;
            let g: number;
            if (i < 16) {
                f = (b & c) | (~b & d);
                g = i;
            } else if (i < 32) {
                f = (d & b) | (~d & c);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                f = b ^ c ^ d;
                g = (3 * i + 5) % 16;
            } else {
                f = c ^ (b | ~d);
                g = (7 * i) % 16;
            }
            const previousD = d;
            d = c;
            c = b;
            const sum = (a + f + MD5_K[i] + buffer[chunk + g]) | 0;
            b = (b + rotl32(sum, MD5_S[i])) | 0;
            a = previousD;
        }
        a0 = (a0 + a) | 0;
        b0 = (b0 + b) | 0;
        c0 = (c0 + c) | 0;
        d0 = (d0 + d) | 0;
    }

    return littleEndianHex(a0) + littleEndianHex(b0) + littleEndianHex(c0) + littleEndianHex(d0);
}

const SHA256_K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const SHA256_INITIAL = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);

export function sha256Hex(input: string): string {
    const bytes = utf8Encode(input);
    const bits = bytes.length * 8;
    const total = Math.ceil((bytes.length + 9) / 64) * 64;
    const data = new Uint8Array(total);
    data.set(bytes, 0);
    data[bytes.length] = 0x80;
    const view = new DataView(data.buffer);
    view.setUint32(total - 8, Math.floor(bits / 0x100000000), false);
    view.setUint32(total - 4, bits >>> 0, false);

    const hash = SHA256_INITIAL.slice();
    const schedule = new Uint32Array(64);

    for (let offset = 0; offset < total; offset += 64) {
        for (let i = 0; i < 16; i++) {
            schedule[i] = view.getUint32(offset + i * 4, false);
        }
        for (let i = 16; i < 64; i++) {
            const s0 = rotr32(schedule[i - 15], 7) ^ rotr32(schedule[i - 15], 18) ^ (schedule[i - 15] >>> 3);
            const s1 = rotr32(schedule[i - 2], 17) ^ rotr32(schedule[i - 2], 19) ^ (schedule[i - 2] >>> 10);
            schedule[i] = (schedule[i - 16] + s0 + schedule[i - 7] + s1) | 0;
        }

        let [a, b, c, d, e, f, g, h] = hash;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
            const choice = (e & f) ^ (~e & g);
            const temp1 = (h + sigma1 + choice + SHA256_K[i] + schedule[i]) | 0;
            const sigma0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
            const majority = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (sigma0 + majority) | 0;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }

        hash[0] = (hash[0] + a) | 0;
        hash[1] = (hash[1] + b) | 0;
        hash[2] = (hash[2] + c) | 0;
        hash[3] = (hash[3] + d) | 0;
        hash[4] = (hash[4] + e) | 0;
        hash[5] = (hash[5] + f) | 0;
        hash[6] = (hash[6] + g) | 0;
        hash[7] = (hash[7] + h) | 0;
    }

    let result = '';
    for (const word of hash) {
        result += (word >>> 0).toString(16).padStart(8, '0');
    }
    return result;
}
