import { t } from '../../utils/i18n';
import { md5Hex, sha256Hex } from '../../utils/hashCore';

const SECURITY_WARNING = t(' [WARNING: Do not use for cryptographic purposes - use a dedicated library]');

export function hashMD5(text: string): { result: string; warning?: string } {
    return {
        result: md5Hex(text),
        warning: t('MD5 is not cryptographically secure') + SECURITY_WARNING
    };
}

export function hashSHA256(text: string): { result: string; warning?: string } {
    return {
        result: sha256Hex(text),
        warning: t('SHA-256 is not cryptographically secure for passwords') + SECURITY_WARNING
    };
}
