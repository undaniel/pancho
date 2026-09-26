import { describe, it, expect } from '@jest/globals';
import { parseColor } from '../../src/transforms/colorInfo';
import { detectContent } from '../../src/transforms/detectContent';
import type { ContentKind } from '../../src/transforms/detectContent';
import { isPotentiallyCatastrophic } from '../../src/utils/safeRegex';

/**
 * Deterministic property/fuzz tests over pure functions.
 *
 * No external fuzzing library: inputs come from a seeded xorshift32 PRNG so a
 * failure is always reproducible from a fixed seed.
 */
const SEED = 0x1234abcd;
const CASES = 2000;

function xorshift32(seed: number): () => number {
  let state = seed >>> 0;
  if (state === 0) state = 0x1a2b3c4d;
  return () => {
    state ^= (state << 13) >>> 0;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= (state << 5) >>> 0;
    state >>>= 0;
    return state >>> 0;
  };
}

function randInt(rng: () => number, maxInclusive: number): number {
  return rng() % (maxInclusive + 1);
}

/** Asserts the call does not throw and returns its value, with a useful failure message. */
function assertNoThrow<T>(fn: () => T, label: string, input: string): T {
  try {
    return fn();
  } catch (error) {
    throw new Error(
      `${label} threw on input ${JSON.stringify(input.slice(0, 120))}: ${String(error)}`
    );
  }
}

const ASCII = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const REGEX_META = '()[]{}*+?.\\|^$/';
const WHITESPACE = ' \t\n\r';
const UNICODE = 'áéíóúñü日本😀Ωλ中';
const HEX_DIGITS = '0123456789abcdef';

function randomString(rng: () => number): string {
  const len = randInt(rng, 60);
  const mode = rng() % 4;
  const pool =
    mode === 0 ? ASCII :
    mode === 1 ? ASCII + REGEX_META + WHITESPACE :
    mode === 2 ? ASCII + HEX_DIGITS + '#rgb(), ' :
    ASCII + REGEX_META + WHITESPACE + UNICODE;
  let out = '';
  for (let i = 0; i < len; i++) out += pool[rng() % pool.length];
  return out;
}

function randomRegexishString(rng: () => number): string {
  const len = randInt(rng, 80);
  const pool = ASCII + REGEX_META.repeat(2) + WHITESPACE;
  let out = '';
  for (let i = 0; i < len; i++) out += pool[rng() % pool.length];
  return out;
}

function randomColorishString(rng: () => number): string {
  const mode = rng() % 5;
  if (mode === 0) {
    let hex = '#';
    for (let i = 0; i < 6; i++) hex += HEX_DIGITS[rng() % 16];
    return hex;
  }
  if (mode === 1) {
    return `rgb(${randInt(rng, 300)},${randInt(rng, 300)},${randInt(rng, 300)})`;
  }
  return randomString(rng);
}

const LONG_TEXT = 'a'.repeat(10000);
const LONG_REGEX = '('.repeat(10001);

const EDGE_CASES: readonly string[] = [
  '',
  '   ',
  '\t\n\r',
  '#fff',
  '#FFFFFF',
  '#ff0000',
  'rgb(0,0,0)',
  'rgb(255,255,255)',
  'rgb(999,0,0)',
  'héllo ñ 日本 😀 Ω',
  '()[]{}*+?.\\|^$',
  LONG_TEXT,
  LONG_REGEX,
];

const CONTENT_KINDS: readonly ContentKind[] = [
  'jwt',
  'json',
  'csv',
  'color',
  'base64',
  'timestamp',
];

describe('fuzz: pure transforms never throw on hostile input', () => {
  describe('parseColor', () => {
    it(`never throws and returns a valid color shape across ${CASES} inputs`, () => {
      const rng = xorshift32(SEED);
      for (let i = 0; i < CASES; i++) {
        const input = randomColorishString(rng);
        const result = assertNoThrow(() => parseColor(input), 'parseColor', input);

        if (result !== null) {
          expect(result.hex).toMatch(/^#[0-9a-f]{6}$/);
          for (const channel of [result.rgb.r, result.rgb.g, result.rgb.b]) {
            expect(Number.isInteger(channel)).toBe(true);
            expect(channel).toBeGreaterThanOrEqual(0);
            expect(channel).toBeLessThanOrEqual(255);
          }
        }
      }
    });

    it('handles the explicit edge cases without throwing', () => {
      for (const input of EDGE_CASES) {
        const result = assertNoThrow(() => parseColor(input), 'parseColor', input);
        if (result !== null) {
          expect(result.hex).toMatch(/^#[0-9a-f]{6}$/);
        }
      }
      expect(parseColor('#fff')).toBeNull();
      expect(parseColor('rgb(999,0,0)')).toBeNull();
    });
  });

  describe('detectContent', () => {
    it(`never throws and stays well-formed across ${CASES} inputs`, () => {
      const rng = xorshift32(SEED ^ 0x5f3759df);
      for (let i = 0; i < CASES; i++) {
        const input = randomString(rng);
        const result = assertNoThrow(() => detectContent(input), 'detectContent', input);

        expect(Array.isArray(result)).toBe(true);
        for (const kind of result) {
          expect(CONTENT_KINDS).toContain(kind);
        }
        expect(new Set(result).size).toBe(result.length);
      }
    });

    it('handles explicit edge cases without duplicates', () => {
      for (const input of EDGE_CASES) {
        const result = assertNoThrow(() => detectContent(input), 'detectContent', input);
        for (const kind of result) expect(CONTENT_KINDS).toContain(kind);
        expect(new Set(result).size).toBe(result.length);
      }
      expect(detectContent('')).toEqual([]);
      expect(detectContent('   ')).toEqual([]);
    });
  });

  describe('isPotentiallyCatastrophic', () => {
    it(`never throws on regex-shaped garbage across ${CASES} inputs`, () => {
      const rng = xorshift32(SEED ^ 0x9e3779b9);
      for (let i = 0; i < CASES; i++) {
        const input = randomRegexishString(rng);
        const result = assertNoThrow(
          () => isPotentiallyCatastrophic(input),
          'isPotentiallyCatastrophic',
          input
        );
        expect(typeof result).toBe('boolean');
      }
    });

    it('handles explicit edge cases and very long patterns', () => {
      for (const input of EDGE_CASES) {
        const result = assertNoThrow(
          () => isPotentiallyCatastrophic(input),
          'isPotentiallyCatastrophic',
          input
        );
        expect(typeof result).toBe('boolean');
      }
      expect(isPotentiallyCatastrophic('')).toBe(false);
      expect(isPotentiallyCatastrophic(LONG_REGEX)).toBe(true);
    });
  });
});
