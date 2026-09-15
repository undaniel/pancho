import { describe, it, expect } from '@jest/globals';
import { isPotentiallyCatastrophic, runRegexJob } from '../../src/utils/safeRegex';

describe('safeRegex', () => {
  describe('isPotentiallyCatastrophic', () => {
    it.each(['(a+)+', '(a*)+', '(\\w+)*', '(.*)*', '(.*)+'])('flags %s', (pattern) => {
      expect(isPotentiallyCatastrophic(pattern)).toBe(true);
    });

    it.each(['\\d+', 'foo|bar', '(ab)+', 'a{2,3}', '[a-z]+', '^hello$', ''])('allows %s', (pattern) => {
      expect(isPotentiallyCatastrophic(pattern)).toBe(false);
    });
  });

  describe('runRegexJob', () => {
    it('exec returns matches with groups', async () => {
      const result = await runRegexJob({ pattern: '(\\d+)', flags: 'g', text: 'a1 b22', mode: 'exec' });
      expect(result.error).toBeUndefined();
      expect(result.matches?.map(m => m.match)).toEqual(['1', '22']);
      expect(result.matches?.[1].groups).toEqual(['22']);
    });

    it('replace returns result and count', async () => {
      const result = await runRegexJob({ pattern: 'a', flags: 'g', text: 'banana', mode: 'replace', replacement: 'o' });
      expect(result.result).toBe('bonono');
      expect(result.count).toBe(3);
    });

    it('count counts occurrences', async () => {
      const result = await runRegexJob({ pattern: 'a', flags: 'g', text: 'banana', mode: 'count' });
      expect(result.count).toBe(3);
    });

    it('rejects catastrophic patterns before running', async () => {
      const result = await runRegexJob({ pattern: '(a+)+$', flags: 'g', text: 'aaaaaaaaaaaaaaaaaaaa!', mode: 'exec' });
      expect(result.error).toBe('complex');
    });

    it('returns invalid for a malformed regex', async () => {
      const result = await runRegexJob({ pattern: '(', flags: 'g', text: 'x', mode: 'exec' });
      expect(result.error).toBe('invalid');
    });

    it('returns empty for an empty pattern', async () => {
      const result = await runRegexJob({ pattern: '', flags: 'g', text: 'x', mode: 'exec' });
      expect(result.error).toBe('empty');
    });
  });
});
