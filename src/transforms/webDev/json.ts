import { t } from '../../utils/i18n';

export function minify(text: string): { result: string; error?: string } {
    try {
        return { result: JSON.stringify(JSON.parse(text)) };
    } catch (e) {
        return { result: text, error: t('Invalid JSON') };
    }
}

export function prettify(text: string, indent: number = 2): { result: string; error?: string } {
    try {
        return { result: JSON.stringify(JSON.parse(text), null, indent) };
    } catch (e) {
        return { result: text, error: t('Invalid JSON') };
    }
}
