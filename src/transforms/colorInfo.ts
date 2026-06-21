export interface ColorInfo {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
}

export function parseColor(input: string): ColorInfo | null {
    const trimmed = input.trim();

    const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(trimmed);
    if (hexMatch) {
        return buildFromRgb(
            parseInt(hexMatch[1], 16),
            parseInt(hexMatch[2], 16),
            parseInt(hexMatch[3], 16)
        );
    }

    const rgbMatch = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(trimmed);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        if (r > 255 || g > 255 || b > 255) return null;
        return buildFromRgb(r, g, b);
    }

    return null;
}

function buildFromRgb(r: number, g: number, b: number): ColorInfo {
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    const hsl = rgbToHsl(r, g, b);
    return { hex, rgb: { r, g, b }, hsl };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    const rN = r / 255;
    const gN = g / 255;
    const bN = b / 255;
    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    let h = 0;
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
        switch (max) {
            case rN: h = ((gN - bN) / d) % 6; break;
            case gN: h = (bN - rN) / d + 2; break;
            case bN: h = (rN - gN) / d + 4; break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function colorInfo(text: string): { result: string; error?: string } {
    const color = parseColor(text);
    if (!color) {
        return { result: text, error: 'Invalid color. Use #RRGGBB or rgb(r,g,b)' };
    }
    const { hex, rgb, hsl } = color;
    return {
        result: [
            `HEX: ${hex}`,
            `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            `HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        ].join('\n')
    };
}
