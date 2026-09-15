import { describe, it, expect } from '@jest/globals';
import { testRegex, formatRegexResult } from '../../src/transforms/regex';

describe('regex transform', () => {
  it('finds matches with groups', async () => {
    const result = await testRegex('(\\d+)', 'g', 'a1 b22');
    expect(result.error).toBeUndefined();
    expect(result.matches).toHaveLength(2);
    expect(result.matches[1].groups).toEqual(['22']);
  });

  it('reports a friendly error for an invalid pattern', async () => {
    const result = await testRegex('(', 'g', 'x');
    expect(result.error).toBe('Invalid pattern');
    expect(result.matches).toHaveLength(0);
  });

  it('blocks catastrophic patterns', async () => {
    const result = await formatRegexResult('(a+)+$', 'g', 'aaaaaaaaaaaaaaaaaaaa!');
    expect(result.error).toMatch(/complex|took too long/i);
  });

  it('reports no matches', async () => {
    const result = await formatRegexResult('zzz', 'g', 'abc');
    expect(result.result).toBe('No matches found');
  });
});
