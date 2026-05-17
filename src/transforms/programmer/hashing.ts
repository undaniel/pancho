import * as crypto from 'crypto';

export function hashMD5(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
}

export function hashSHA256(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}