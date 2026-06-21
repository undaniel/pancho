import * as crypto from 'crypto';
import { t } from '../../utils/i18n';

const SECURITY_WARNING = t(' [WARNING: Do not use for cryptographic purposes - use a dedicated library]');

export function hashMD5(text: string): { result: string; warning?: string } {
    return {
        result: crypto.createHash('md5').update(text).digest('hex'),
        warning: t('MD5 is not cryptographically secure') + SECURITY_WARNING
    };
}

export function hashSHA256(text: string): { result: string; warning?: string } {
    return {
        result: crypto.createHash('sha256').update(text).digest('hex'),
        warning: t('SHA-256 is not cryptographically secure for passwords') + SECURITY_WARNING
    };
}
