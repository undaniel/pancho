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
    cancelled?: boolean;
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
    transform: PerSelectionTransform,
    shouldCancel?: () => boolean
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
        if (shouldCancel?.()) {
            return { edits: [], cancelled: true };
        }
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


