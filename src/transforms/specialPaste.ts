export function pasteWithoutLineBreak(text: string): string {
    return text.replace(/[\r\n]+/g, ' ').trim();
}

export function joinLines(text: string, separator: string = ' '): string {
    return text.split('\n').map(line => line.trim()).filter(line => line).join(separator);
}

export function copyToMultipleLines(text: string, times: number = 10): string {
    return Array(times).fill(text).join('\n');
}

export function insertSpecialCharacter(char: string): string {
    return char;
}

export const SPECIAL_CHARACTERS: Record<string, string> = {
    'Degree': '\u00B0',
    'Copyright': '\u00A9',
    'Registered': '\u00AE',
    ' Trademark': '\u2122',
    'Section': '\u00A7',
    'Pilcrow': '\u00B6',
    'DoubleQuote': '\u201C',
    'SingleQuote': '\u2018',
    'Ellipsis': '\u2026',
    'EnDash': '\u2013',
    'EmDash': '\u2014',
    'Bullet': '\u2022',
    'Square': '\u25A1',
    'Check': '\u2713',
    'Cross': '\u2717',
    'Star': '\u2605',
    'Heart': '\u2665',
    'Euro': '\u20AC',
    'Pound': '\u00A3',
    'Yen': '\u00A5',
};

export function formatAsCSV(text: string): string {
    const lines = text.split('\n');
    return lines.map(line => {
        const cells = line.split('\t');
        return cells.map(cell => {
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        }).join(',');
    }).join('\n');
}