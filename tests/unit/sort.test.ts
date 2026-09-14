import { describe, it, expect } from '@jest/globals';
import { sortNatural, sortNaturalDescending } from '../../src/transforms/sort';

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
