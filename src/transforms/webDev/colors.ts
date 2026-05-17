export function hexToRgb(hex: string): { result: string; error?: string } {
    const trimmed = hex.trim();
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(trimmed);
    if (!result) {
        return { result: trimmed, error: 'Hex inválido. Use formato: #RRGGBB o RRGGBB' };
    }
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return { result: `rgb(${r}, ${g}, ${b})` };
}

export function rgbToHex(rgb: string): { result: string; error?: string } {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(rgb.trim());
    if (!result) {
        return { result: rgb.trim(), error: 'RGB inválido. Use formato: rgb(255, 255, 255)' };
    }
    const r = parseInt(result[1]);
    const g = parseInt(result[2]);
    const b = parseInt(result[3]);
    if (r > 255 || g > 255 || b > 255) {
        return { result: rgb.trim(), error: 'Valores RGB deben estar entre 0 y 255' };
    }
    return { result: '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('') };
}