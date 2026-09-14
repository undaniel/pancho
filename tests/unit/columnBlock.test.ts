import { describe, it, expect } from '@jest/globals';
import { detectColumnBlock, insertAtColumns, deleteColumns, copyColumns, pasteColumns } from '../../src/core/columnBlock';

const sel = (line: number, column: number, endColumn = column) => ({
  startLine: line,
  startChar: column,
  endLine: line,
  endChar: endColumn,
});

describe('detectColumnBlock', () => {
  it('detects a block of consecutive lines at the same column', () => {
    expect(detectColumnBlock([sel(0, 1), sel(1, 1), sel(2, 1)])).toEqual({
      startLine: 0,
      endLine: 2,
      column: 1,
      endColumn: 1,
    });
  });

  it('returns undefined for different columns', () => {
    expect(detectColumnBlock([sel(0, 1), sel(1, 2)])).toBeUndefined();
  });

  it('returns undefined for non-consecutive lines', () => {
    expect(detectColumnBlock([sel(0, 1), sel(2, 1)])).toBeUndefined();
  });

  it('returns undefined for a single selection', () => {
    expect(detectColumnBlock([sel(0, 1)])).toBeUndefined();
  });
});

describe('column operations', () => {
  const text = 'ab\ncd\nef';
  const block = { startLine: 0, endLine: 2, column: 1, endColumn: 1 };

  it('inserts text at the column on every line', () => {
    expect(insertAtColumns(text, block, 'X')).toBe('aXb\ncXd\neXf');
  });

  it('deletes the column strip', () => {
    expect(deleteColumns(text, { ...block, endColumn: 2 })).toBe('a\nc\ne');
  });

  it('copies the column strip', () => {
    expect(copyColumns(text, { ...block, endColumn: 2 })).toBe('b\nd\nf');
  });

  it('pastes lines into a zero-width column (insert mode)', () => {
    expect(pasteColumns(text, block, '1\n2\n3')).toBe('a1b\nc2d\ne3f');
  });

  it('pastes over the selected column strip', () => {
    expect(pasteColumns(text, { ...block, endColumn: 2 }, '1\n2\n3')).toBe('a1\nc2\ne3');
  });

  it('clamps when the column is past the end of a line', () => {
    expect(insertAtColumns('a\nbb', { startLine: 0, endLine: 1, column: 5, endColumn: 5 }, '!')).toBe('a!\nbb!');
  });
});
