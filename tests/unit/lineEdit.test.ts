import { describe, it, expect } from '@jest/globals';
import { duplicateLine, insertLineBefore, insertLineAfter, deleteLinesContaining, keepOnlyLinesContaining } from '../../src/transforms/lineEdit';

describe('lineEdit', () => {
  it('duplicates every line', () => {
    expect(duplicateLine('a\nb')).toBe('a\na\nb\nb');
  });

  it('inserts a line before and after', () => {
    expect(insertLineBefore('a')).toBe('\na');
    expect(insertLineAfter('a')).toBe('a\n');
  });

  it('deletes lines containing a pattern', () => {
    expect(deleteLinesContaining('a\nb\nc', 'b')).toBe('a\nc');
  });

  it('keeps only lines containing a pattern', () => {
    expect(keepOnlyLinesContaining('a\nb\nc', 'b')).toBe('b');
  });
});
