export function pasteWithoutLineBreak(text: string): string {
    return text.replace(/[\r\n]+/g, ' ').trim();
}

export function copyToMultipleLines(text: string, times: number = 10): string {
    return Array(times).fill(text).join('\n');
}

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
