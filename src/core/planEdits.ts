export type TextOutput = string | { result: string; error?: string; warning?: string };

export interface SelectionRange {
    start: number;
    end: number;
}

export interface PlannedEdit {
    start: number;
    end: number;
    text: string;
}

export interface PlanResult {
    edits: PlannedEdit[];
    error?: string;
    warning?: string;
}

export type PerSelectionTransform = (text: string) => TextOutput | Promise<TextOutput>;

function processOutput<T>(value: T | { result: T; error?: string; warning?: string }): { value: T; error?: string; warning?: string } {
    if (typeof value === 'object' && value !== null && 'result' in value) {
        const result = value as { result: T; error?: string; warning?: string };
        return { value: result.result, error: result.error, warning: result.warning };
    }
    return { value: value as T };
}

function normalize(selections: SelectionRange[], textLength: number): SelectionRange[] {
    const clamp = (n: number) => Math.max(0, Math.min(n, textLength));
    const normalized = selections
        .map(s => {
            const start = clamp(s.start);
            const end = clamp(s.end);
            return start <= end ? { start, end } : { start: end, end: start };
        })
        .sort((a, b) => a.start - b.start || a.end - b.end);

    const merged: SelectionRange[] = [];
    for (const range of normalized) {
        const last = merged[merged.length - 1];
        if (last && range.start <= last.end) {
            last.end = Math.max(last.end, range.end);
        } else {
            merged.push({ ...range });
        }
    }
    return merged;
}

export function applyPlannedEdits(text: string, edits: PlannedEdit[]): string {
    const sorted = [...edits].sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of sorted) {
        result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
    }
    return result;
}

export function lineStartAt(text: string, offset: number): number {
    if (offset <= 0) return 0;
    const newline = text.lastIndexOf('\n', offset - 1);
    return newline === -1 ? 0 : newline + 1;
}

export function lineEndAt(text: string, offset: number): number {
    const newline = text.indexOf('\n', offset);
    return newline === -1 ? text.length : newline;
}

/**
 * Plans per-selection edits. Empty cursors expand to their whole line.
 * Overlapping/duplicate ranges are merged, and any error aborts all edits.
 */
export async function planSelectionEdits(
    documentText: string,
    selections: SelectionRange[],
    transform: PerSelectionTransform
): Promise<PlanResult> {
    const base = normalize(selections, documentText.length);
    const expanded = base.map(range =>
        range.start === range.end
            ? { start: lineStartAt(documentText, range.start), end: lineEndAt(documentText, range.end) }
            : range
    );
    const ranges = normalize(expanded, documentText.length);

    const edits: PlannedEdit[] = [];
    let warning: string | undefined;

    for (const range of ranges) {
        const slice = documentText.slice(range.start, range.end);
        const processed = processOutput(await transform(slice));
        if (processed.error) {
            return { edits: [], error: processed.error };
        }
        if (!warning && processed.warning) warning = processed.warning;
        edits.push({ start: range.start, end: range.end, text: processed.value });
    }

    return { edits, warning };
}

function toBlocks(sortedIndices: number[]): [number, number][] {
    const blocks: [number, number][] = [];
    let start = sortedIndices[0];
    let previous = sortedIndices[0];
    for (let i = 1; i < sortedIndices.length; i++) {
        if (sortedIndices[i] === previous + 1) {
            previous = sortedIndices[i];
        } else {
            blocks.push([start, previous]);
            start = sortedIndices[i];
            previous = sortedIndices[i];
        }
    }
    blocks.push([start, previous]);
    return blocks;
}

/**
 * Moves the selected lines (grouped into contiguous blocks) one step up or down.
 * Unselected lines between blocks stay in place. A single index matches the
 * classic single-line move behavior.
 */
export function moveSelectedLines(text: string, lineIndices: number[], direction: 'up' | 'down'): string {
    const lines = text.split('\n');
    const selected = Array.from(new Set(lineIndices))
        .filter(i => Number.isInteger(i) && i >= 0 && i < lines.length)
        .sort((a, b) => a - b);
    if (selected.length === 0) return text;

    const blocks = toBlocks(selected);

    if (direction === 'up') {
        for (const [start, end] of blocks) {
            if (start === 0) continue;
            const moved = lines.splice(start - 1, 1)[0];
            lines.splice(end, 0, moved);
        }
    } else {
        for (let b = blocks.length - 1; b >= 0; b--) {
            const [start, end] = blocks[b];
            if (end === lines.length - 1) continue;
            const moved = lines.splice(end + 1, 1)[0];
            lines.splice(start, 0, moved);
        }
    }

    return lines.join('\n');
}
