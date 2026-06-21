import { t } from '../../utils/i18n';

export function toBinary(text: string): { result: string } {
    return { result: text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ') };
}

export function fromBinary(binary: string): { result: string; error?: string } {
    try {
        const result = binary.split(' ').map(b => {
            if (!/^[01]{8}$/.test(b.trim())) throw new Error('Invalid');
            return String.fromCharCode(parseInt(b.trim(), 2));
        }).join('');
        return { result };
    } catch {
        return { result: binary, error: t('Invalid binary. Use 8 bits separated by spaces (e.g.: 01000001 01000010)') };
    }
}

export function toHex(text: string): { result: string } {
    return { result: text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ') };
}

export function fromHex(hex: string): { result: string; error?: string } {
    try {
        const result = hex.split(/([a-fA-F0-9]{2})/).filter(Boolean).map(h => String.fromCharCode(parseInt(h, 16))).join('');
        if (!/^[a-fA-F0-9\s]+$/.test(hex)) {
            return { result, error: t('Invalid hex') };
        }
        return { result };
    } catch {
        return { result: hex, error: t('Invalid hex') };
    }
}
