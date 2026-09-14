import { describe, it, expect } from '@jest/globals';
import { csvToMarkdown } from '../../src/transforms/convert';

describe('convert edge cases', () => {
  it('aligns markdown table columns', () => {
    const result = csvToMarkdown('a,bb\n1,2');
    expect(result.error).toBeUndefined();
    const lines = (result.result as string).split('\n');
    expect(lines[0]).toBe('| a | bb |');
    expect(lines[1]).toBe('| - | -- |');
  });

  it('handles very wide CSVs without throwing RangeError', () => {
    const columns = 150000;
    const headers = Array.from({ length: columns }, (_, i) => 'c' + i).join(',');
    const row = Array.from({ length: columns }, (_, i) => 'v' + i).join(',');
    const result = csvToMarkdown(headers + '\n' + row);
    expect(result.error).toBeUndefined();
    expect((result.result as string).split('\n')).toHaveLength(3);
  });
});
