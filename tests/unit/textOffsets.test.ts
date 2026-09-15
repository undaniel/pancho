import { describe, it, expect } from '@jest/globals';
import { computeLineStarts, lineIndexAtOffset, lineTextAt } from '../../src/core/textOffsets';

describe('textOffsets', () => {
  it('computes line starts', () => {
    expect(computeLineStarts('a\nb\nc')).toEqual([0, 2, 4]);
  });

  it('maps offsets to line indices', () => {
    const starts = computeLineStarts('a\nbb\nccc');
    expect(lineIndexAtOffset(starts, 0)).toBe(0);
    expect(lineIndexAtOffset(starts, 2)).toBe(1);
    expect(lineIndexAtOffset(starts, 5)).toBe(2);
    expect(lineIndexAtOffset(starts, 6)).toBe(2);
  });

  it('extracts a line text', () => {
    const text = 'a\nbb\nccc';
    const starts = computeLineStarts(text);
    expect(lineTextAt(text, starts, 0)).toBe('a');
    expect(lineTextAt(text, starts, 1)).toBe('bb');
    expect(lineTextAt(text, starts, 2)).toBe('ccc');
  });
});
