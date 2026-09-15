import { describe, it, expect } from '@jest/globals';
import { countWords, countCharacters, countLines } from '../../src/transforms/textGeneral/counters';
import { removeDuplicateWords, numberLines, removeLineNumbers, slugify, reverseWords, randomizeLines } from '../../src/transforms/textGeneral/modifiers';

describe('counters', () => {
  it('counts words, characters and lines', () => {
    expect(countWords('hello world')).toBe(2);
    expect(countWords('   ')).toBe(0);
    expect(countCharacters('ab')).toBe(2);
    expect(countLines('a\nb')).toBe(2);
    expect(countLines('')).toBe(1);
  });
});

describe('modifiers', () => {
  it('removes duplicate words case-insensitively', () => {
    expect(removeDuplicateWords('a b A c')).toBe('a b c');
  });

  it('numbers and unnumbers lines', () => {
    expect(numberLines('a\nb')).toBe('1: a\n2: b');
    expect(removeLineNumbers('1: a\n2: b')).toBe('a\nb');
  });

  it('slugifies text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  --a--  ')).toBe('a');
  });

  it('reverses words', () => {
    expect(reverseWords('a b c')).toBe('c b a');
  });

  it('randomizes lines without losing any', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const output = randomizeLines(input.join('\n')).split('\n');
    expect([...output].sort()).toEqual([...input].sort());
  });
});
