import { describe, it, expect } from '@jest/globals';
import { sortNatural, sortNaturalDescending, sortByColumn } from '../../src/transforms/sort';

describe('sort natural', () => {
  it('orders numeric suffixes naturally', () => {
    expect(sortNatural(['file10', 'file2', 'file1'].join('\n'))).toBe(['file1', 'file2', 'file10'].join('\n'));
  });

  it('orders version-like strings naturally', () => {
    expect(sortNatural(['v1.10', 'v1.2', 'v1.1'].join('\n'))).toBe(['v1.1', 'v1.2', 'v1.10'].join('\n'));
  });

  it('sorts descending', () => {
    expect(sortNaturalDescending(['file2', 'file10', 'file1'].join('\n'))).toBe(['file10', 'file2', 'file1'].join('\n'));
  });

  it('handles a large number of lines efficiently', () => {
    const lines = Array.from({ length: 20000 }, (_, i) => `item${i}`);
    const sorted = sortNatural(lines.join('\n')).split('\n');
    expect(sorted[0]).toBe('item0');
    expect(sorted[sorted.length - 1]).toBe('item19999');
  });
});

describe('sort by column', () => {
  it('sorts by a zero-based column', () => {
    const input = ['b,3', 'a,1', 'c,2'].join('\n');
    expect(sortByColumn(input, { delimiter: ',', column: 0 })).toBe(['a,1', 'b,3', 'c,2'].join('\n'));
    expect(sortByColumn(input, { delimiter: ',', column: 1, numeric: true })).toBe(['a,1', 'c,2', 'b,3'].join('\n'));
  });

  it('sorts numerically when asked', () => {
    const input = ['x,10', 'x,2', 'x,1'].join('\n');
    expect(sortByColumn(input, { delimiter: ',', column: 1, numeric: true })).toBe(['x,1', 'x,2', 'x,10'].join('\n'));
  });

  it('keeps the header in place', () => {
    const input = ['name,age', 'luis,30', 'ana,25'].join('\n');
    expect(sortByColumn(input, { delimiter: ',', column: 1, numeric: true, hasHeader: true }))
      .toBe(['name,age', 'ana,25', 'luis,30'].join('\n'));
  });

  it('supports tab delimiters', () => {
    const input = ['b\t2', 'a\t1'].join('\n');
    expect(sortByColumn(input, { delimiter: '\t', column: 0 })).toBe(['a\t1', 'b\t2'].join('\n'));
  });
});
