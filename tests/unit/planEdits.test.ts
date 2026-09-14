import { describe, it, expect } from '@jest/globals';
import { planSelectionEdits, applyPlannedEdits } from '../../src/core/planEdits';

describe('planSelectionEdits', () => {
  it('expands an empty cursor to its whole line', async () => {
    const plan = await planSelectionEdits('foo\nbar', [{ start: 5, end: 5 }], text => text.toUpperCase());
    expect(plan.edits).toEqual([{ start: 4, end: 7, text: 'BAR' }]);
  });

  it('applies per selection for multiple ranges', async () => {
    const plan = await planSelectionEdits('abc def', [{ start: 0, end: 3 }, { start: 4, end: 7 }], text => text.toUpperCase());
    expect(plan.edits).toEqual([
      { start: 0, end: 3, text: 'ABC' },
      { start: 4, end: 7, text: 'DEF' },
    ]);
  });

  it('merges overlapping ranges', async () => {
    const plan = await planSelectionEdits('abcdef', [{ start: 0, end: 4 }, { start: 2, end: 6 }], text => text.toUpperCase());
    expect(plan.edits).toEqual([{ start: 0, end: 6, text: 'ABCDEF' }]);
  });

  it('dedupes cursors on the same line', async () => {
    const plan = await planSelectionEdits('abc', [{ start: 1, end: 1 }, { start: 2, end: 2 }], text => text.toUpperCase());
    expect(plan.edits).toEqual([{ start: 0, end: 3, text: 'ABC' }]);
  });

  it('aborts all edits when any selection errors', async () => {
    const plan = await planSelectionEdits('a\nb', [{ start: 0, end: 0 }, { start: 2, end: 2 }], text =>
      text === 'b' ? { result: text, error: 'boom' } : text.toUpperCase()
    );
    expect(plan.error).toBe('boom');
    expect(plan.edits).toEqual([]);
  });
});

describe('applyPlannedEdits', () => {
  it('applies multiple edits right-to-left without shifting offsets', () => {
    expect(applyPlannedEdits('abc def', [{ start: 0, end: 3, text: 'X' }, { start: 4, end: 7, text: 'Y' }])).toBe('X Y');
  });

  it('supports insertions at an empty range', () => {
    expect(applyPlannedEdits('ab', [{ start: 1, end: 1, text: 'X' }])).toBe('aXb');
  });

  it('returns the text unchanged for no edits', () => {
    expect(applyPlannedEdits('abc', [])).toBe('abc');
  });
});

