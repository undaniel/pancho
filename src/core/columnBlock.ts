export interface SelectionLike {
    startLine: number;
    startChar: number;
    endLine: number;
    endChar: number;
}

export interface ColumnBlock {
    startLine: number;
    endLine: number;
    column: number;
    endColumn: number;
}

/**
 * A column block is detected when every selection lives on a consecutive line,
 * at the same start/end column (VS Code turns alt-drag into these cursors).
 */
export function detectColumnBlock(selections: SelectionLike[]): ColumnBlock | undefined {
    if (selections.length < 2) return undefined;

    const sorted = [...selections].sort((a, b) => a.startLine - b.startLine);
    const column = sorted[0].startChar;
    const endColumn = sorted[0].endChar;

    if (sorted.some(s => s.startChar !== column || s.endChar !== endColumn)) return undefined;
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].startLine !== sorted[i - 1].startLine + 1) return undefined;
    }

    return {
        startLine: sorted[0].startLine,
        endLine: sorted[sorted.length - 1].startLine,
        column,
        endColumn,
    };
}

function clamp(value: number, max: number): number {
    return Math.max(0, Math.min(value, max));
}

export function insertAtColumns(text: string, block: ColumnBlock, inserted: string): string {
    const lines = text.split('\n');
    for (let line = block.startLine; line <= block.endLine && line < lines.length; line++) {
        const at = clamp(block.column, lines[line].length);
        lines[line] = lines[line].slice(0, at) + inserted + lines[line].slice(at);
    }
    return lines.join('\n');
}

export function deleteColumns(text: string, block: ColumnBlock): string {
    const lines = text.split('\n');
    for (let line = block.startLine; line <= block.endLine && line < lines.length; line++) {
        const start = clamp(block.column, lines[line].length);
        const end = clamp(block.endColumn, lines[line].length);
        lines[line] = lines[line].slice(0, start) + lines[line].slice(end);
    }
    return lines.join('\n');
}

export function copyColumns(text: string, block: ColumnBlock): string {
    const lines = text.split('\n');
    const out: string[] = [];
    for (let line = block.startLine; line <= block.endLine && line < lines.length; line++) {
        const start = clamp(block.column, lines[line].length);
        const end = clamp(block.endColumn, lines[line].length);
        out.push(lines[line].slice(start, end));
    }
    return out.join('\n');
}

export function fillSeriesAtColumn(text: string, block: ColumnBlock, start: number, step: number): string {
    const lines = text.split('\n');
    const count = block.endLine - block.startLine + 1;
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
        values.push(String(start + i * step));
    }
    const width = values.reduce((max, value) => Math.max(max, value.length), 0);

    for (let i = 0; i < count; i++) {
        const line = block.startLine + i;
        if (line >= lines.length) break;
        const padded = values[i].padStart(width);
        const startAt = clamp(block.column, lines[line].length);
        const endAt = clamp(block.endColumn, lines[line].length);
        lines[line] = lines[line].slice(0, startAt) + padded + lines[line].slice(endAt);
    }
    return lines.join('\n');
}

export function pasteColumns(text: string, block: ColumnBlock, content: string): string {
    const lines = text.split('\n');
    const pasted = content.split(/\r?\n/);
    for (let i = 0; i < pasted.length && block.startLine + i <= block.endLine; i++) {
        const line = block.startLine + i;
        if (line >= lines.length) break;
        const start = clamp(block.column, lines[line].length);
        const end = clamp(block.endColumn, lines[line].length);
        lines[line] = lines[line].slice(0, start) + pasted[i] + lines[line].slice(end);
    }
    return lines.join('\n');
}
