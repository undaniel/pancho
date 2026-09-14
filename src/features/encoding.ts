export interface EncodingInfo {
    encoding: string;
    bom: boolean;
}

export function isValidUtf8(bytes: Uint8Array): boolean {
    let i = 0;
    while (i < bytes.length) {
        const byte = bytes[i];
        if (byte <= 0x7f) {
            i++;
        } else if (byte >= 0xc2 && byte <= 0xdf) {
            if (!isContinuation(bytes, i + 1)) return false;
            i += 2;
        } else if (byte >= 0xe0 && byte <= 0xef) {
            if (!isContinuation(bytes, i + 1) || !isContinuation(bytes, i + 2)) return false;
            i += 3;
        } else if (byte >= 0xf0 && byte <= 0xf4) {
            if (!isContinuation(bytes, i + 1) || !isContinuation(bytes, i + 2) || !isContinuation(bytes, i + 3)) return false;
            i += 4;
        } else {
            return false;
        }
    }
    return true;
}

function isContinuation(bytes: Uint8Array, index: number): boolean {
    if (index >= bytes.length) return false;
    const byte = bytes[index];
    return byte >= 0x80 && byte <= 0xbf;
}

export function detectEncoding(bytes: Uint8Array): EncodingInfo {
    if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        return { encoding: 'UTF-8', bom: true };
    }
    if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
        return { encoding: 'UTF-16 LE', bom: true };
    }
    if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
        return { encoding: 'UTF-16 BE', bom: true };
    }
    if (isValidUtf8(bytes)) {
        return { encoding: 'UTF-8', bom: false };
    }
    return { encoding: 'Latin-1 (ANSI)', bom: false };
}
