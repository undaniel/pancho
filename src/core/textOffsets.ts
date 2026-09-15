export function computeLineStarts(text: string): number[] {
    const starts = [0];
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) === 10) starts.push(i + 1);
    }
    return starts;
}

export function lineIndexAtOffset(lineStarts: number[], offset: number): number {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
        const mid = (low + high + 1) >> 1;
        if (lineStarts[mid] <= offset) low = mid;
        else high = mid - 1;
    }
    return low;
}

export function lineTextAt(text: string, lineStarts: number[], line: number): string {
    const start = lineStarts[line];
    const end = line < lineStarts.length - 1 ? lineStarts[line + 1] : text.length;
    return text.slice(start, end).replace(/\r?\n$/, '');
}
