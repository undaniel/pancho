import { describe, it, expect } from '@jest/globals';
import { toUpper, toLower, toTitleCase } from '../../src/transforms/case';

describe('case.ts', () => {
  describe('toUpper', () => {
    it('should convert lowercase to uppercase', () => {
      expect(toUpper('hello')).toBe('HELLO');
    });

    it('should handle mixed case', () => {
      expect(toUpper('HeLLo WoRLD')).toBe('HELLO WORLD');
    });

    it('should return empty string for empty input', () => {
      expect(toUpper('')).toBe('');
    });

    it('should handle numbers and symbols unchanged', () => {
      expect(toUpper('abc123!@#')).toBe('ABC123!@#');
    });
  });

  describe('toLower', () => {
    it('should convert uppercase to lowercase', () => {
      expect(toLower('HELLO')).toBe('hello');
    });

    it('should handle mixed case', () => {
      expect(toLower('HeLLo WoRLD')).toBe('hello world');
    });

    it('should return empty string for empty input', () => {
      expect(toLower('')).toBe('');
    });

    it('should handle numbers and symbols unchanged', () => {
      expect(toLower('ABC123!@#')).toBe('abc123!@#');
    });
  });

  describe('toTitleCase', () => {
    it('should capitalize first letter of each word', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle multiple words', () => {
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('should handle already capitalized words', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });
  });
});