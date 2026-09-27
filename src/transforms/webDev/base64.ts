import { t } from '../../utils/i18n';
import { utf8ToBase64, base64ToUtf8 } from '../../utils/bytes';

export function encode(text: string): { result: string } {
    return { result: utf8ToBase64(text) };
}

export function decode(text: string): { result: string; error?: string } {
    try {
        const trimmed = text.trim();
        const decoded = base64ToUtf8(trimmed);
        if (trimmed !== utf8ToBase64(decoded)) {
            return { result: decoded, error: t('Potentially invalid Base64') };
        }
        return { result: decoded };
    } catch {
        return { result: text, error: t('Invalid Base64') };
    }
}
