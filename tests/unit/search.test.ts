import { describe, it, expect } from '@jest/globals';
import { highlightMatches, countMatches } from '../../src/transforms/search';

describe('search', () => {
  it('highlights matches', async () => {
    expect((await highlightMatches('foo bar', 'foo')).result).toBe('==$0== bar');
  });

  it('counts matches', async () => {
    expect((await countMatches('a a a', 'a')).result).toBe(3);
  });

  it('reports an empty pattern', async () => {
    expect((await highlightMatches('x', '')).error).toBeTruthy();
    expect((await countMatches('x', '')).result).toBe(0);
  });

  it('blocks catastrophic patterns', async () => {
    const result = await highlightMatches('aaaaaaaaaaaaaaaaaaaa!', '(a+)+$');
    expect(result.error).toMatch(/complex|took too long|invalid/i);
  });
});
