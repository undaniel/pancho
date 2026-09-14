import { describe, it, expect } from '@jest/globals';
import { deleteLinesContaining, keepOnlyLinesContaining } from '../../src/transforms/lineEdit';

describe('lineEdit', () => {
  it('deletes lines containing a pattern', () => {
    expect(deleteLinesContaining('a\nb\nc', 'b')).toBe('a\nc');
  });

  it('keeps only lines containing a pattern', () => {
    expect(keepOnlyLinesContaining('a\nb\nc', 'b')).toBe('b');
  });
});
