import * as crypto from 'crypto';

const SECURITY_WARNING = ' [ADVERTENCIA: No usar para propósitos criptográficos - usar biblioteca dedicada]';

export function hashMD5(text: string): { result: string; warning?: string } {
    return {
        result: crypto.createHash('md5').update(text).digest('hex'),
        warning: 'MD5 no es criptográficamente seguro' + SECURITY_WARNING
    };
}

export function hashSHA256(text: string): { result: string; warning?: string } {
    return {
        result: crypto.createHash('sha256').update(text).digest('hex'),
        warning: 'SHA-256 no es criptográficamente seguro para contraseñas' + SECURITY_WARNING
    };
}