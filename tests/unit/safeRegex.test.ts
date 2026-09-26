import { describe, it, expect } from '@jest/globals';
import * as path from 'path';
import { isPotentiallyCatastrophic, runRegexJob } from '../../src/utils/safeRegex';

const SLOW_WORKER = path.join(__dirname, '..', 'fixtures', 'regexSlowWorker.js');

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

    it('exec exposes named groups', async () => {
      const result = await runRegexJob({ pattern: '(?<year>\\d{4})-(?<month>\\d{2})', flags: 'g', text: '2024-06', mode: 'exec' });
      expect(result.error).toBeUndefined();
      expect(result.matches?.[0].namedGroups).toEqual({ year: '2024', month: '06' });
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

    it('returns cancelled when the signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();
      const result = await runRegexJob(
        { pattern: 'a', flags: 'g', text: 'banana', mode: 'count' },
        { signal: controller.signal }
      );
      expect(result.error).toBe('cancelled');
    });

    it('cancels a job running in the worker', async () => {
      const controller = new AbortController();
      const promise = runRegexJob(
        { pattern: 'a', flags: 'g', text: 'a', mode: 'exec' },
        { signal: controller.signal, workerFile: SLOW_WORKER }
      );
      controller.abort();
      expect((await promise).error).toBe('cancelled');
    });

    it('runs a later job in the worker after a cancellation', async () => {
      const controller = new AbortController();
      const cancelled = runRegexJob(
        { pattern: 'a', flags: 'g', text: 'a', mode: 'exec' },
        { signal: controller.signal, workerFile: SLOW_WORKER }
      );
      controller.abort();
      await cancelled;
      const result = await runRegexJob(
        { pattern: 'a', flags: 'g', text: 'a', mode: 'exec' },
        { workerFile: SLOW_WORKER }
      );
      expect(result.error).toBeUndefined();
      expect(result.matches).toEqual([]);
    });
  });
});
