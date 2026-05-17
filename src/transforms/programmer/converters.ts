export function toBinary(text: string): string {
    return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

export function fromBinary(binary: string): string {
    return binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

export function toHex(text: string): string {
    return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

export function fromHex(hex: string): string {
    return hex.split(/([a-fA-F0-9]{2})/).filter(Boolean).map(h => String.fromCharCode(parseInt(h, 16))).join('');
}