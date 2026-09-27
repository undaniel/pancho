import { describe, it, expect, beforeAll } from '@jest/globals';
import { removeDuplicateLines, removeConsecutiveDuplicateLines, reverseLines } from '../../src/transforms/lines';
import { sortNatural, sortByLength } from '../../src/transforms/sort';
import { cleanWhitespace } from '../../src/transforms/whitespace';
import { trimLines } from '../../src/transforms/lineUtils';
import { toSnakeCase, toKebabCase } from '../../src/transforms/case';
import { escapeJSON } from '../../src/transforms/escape';
import { encode } from '../../src/transforms/webDev/base64';
import { minify } from '../../src/transforms/webDev/json';

/**
 * Coarse performance budgets. Deliberately generous so they stay stable on CI
 * while still catching accidental quadratic regressions.
 */
const BUDGET_MS = 2500;
const LINES = 20000;

const text = Array.from(
  { length: LINES },
  (_, i) => `  Line ${i} -- Some  Value ${i % 977}  `,
).join('\n');

const json = JSON.stringify({
  items: Array.from({ length: 4000 }, (_, i) => ({ id: i, name: `Item ${i}`, tags: ['alpha', 'beta'] })),
});

const cases: Array<[string, () => unknown]> = [
  ['removeDuplicateLines', () => removeDuplicateLines(text)],
  ['removeConsecutiveDuplicateLines', () => removeConsecutiveDuplicateLines(text)],
  ['sortNatural', () => sortNatural(text)],
  ['sortByLength', () => sortByLength(text)],
  ['reverseLines', () => reverseLines(text)],
  ['cleanWhitespace', () => cleanWhitespace(text)],
  ['trimLines', () => trimLines(text)],
  ['toSnakeCase', () => toSnakeCase(text)],
  ['toKebabCase', () => toKebabCase(text)],
  ['escapeJSON', () => escapeJSON(text)],
  ['base64 encode', () => encode(text)],
  ['json minify', () => minify(json)],
];

describe('performance budgets', () => {
  beforeAll(() => {
    // Warm up the JIT so the first measured case is not penalized.
    for (const [, run] of cases) run();
  });

  it.each(cases)('%s stays within budget', (_name, run) => {
    const start = performance.now();
    run();
    expect(performance.now() - start).toBeLessThan(BUDGET_MS);
  });
});
