import { describe, it, expect } from '@jest/globals';
import { planSelectionEdits, moveSelectedLines, applyPlannedEdits } from '../../src/core/planEdits';

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

describe('moveSelectedLines', () => {
  const text = 'L0\nL1\nL2\nL3';

  it('moves a single line up', () => {
    expect(moveSelectedLines(text, [2], 'up')).toBe('L0\nL2\nL1\nL3');
  });

  it('moves a single line down', () => {
    expect(moveSelectedLines(text, [1], 'down')).toBe('L0\nL2\nL1\nL3');
  });

  it('does nothing at the boundaries', () => {
    expect(moveSelectedLines(text, [0], 'up')).toBe(text);
    expect(moveSelectedLines(text, [3], 'down')).toBe(text);
  });

  it('moves a contiguous block up as a unit', () => {
    expect(moveSelectedLines(text, [1, 2], 'up')).toBe('L1\nL2\nL0\nL3');
  });

  it('moves a contiguous block down as a unit', () => {
    expect(moveSelectedLines(text, [1, 2], 'down')).toBe('L0\nL3\nL1\nL2');
  });

  it('moves non-contiguous selections independently', () => {
    expect(moveSelectedLines(text, [0, 2], 'down')).toBe('L1\nL0\nL3\nL2');
  });
});
