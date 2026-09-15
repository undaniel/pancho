import { describe, it, expect } from '@jest/globals';
import {
  removeDuplicateLines,
  reverseLines,
  removeEmptyLines,
  removeLinesContaining,
  removeAllSpaces,
} from '../../src/transforms/lines';

describe('lines.ts', () => {
  describe('removeDuplicateLines', () => {
    it('should remove duplicate lines', () => {
      const input = 'apple\nbanana\napple\ncherry\nbanana';
      expect(removeDuplicateLines(input)).toBe('apple\nbanana\ncherry');
    });

    it('should handle no duplicates', () => {
      const input = 'apple\nbanana\ncherry';
      expect(removeDuplicateLines(input)).toBe('apple\nbanana\ncherry');
    });

    it('should handle empty string', () => {
      expect(removeDuplicateLines('')).toBe('');
    });
  });

  describe('reverseLines', () => {
    it('should reverse line order', () => {
      const input = 'line1\nline2\nline3';
      expect(reverseLines(input)).toBe('line3\nline2\nline1');
    });

    it('should handle single line', () => {
      expect(reverseLines('single')).toBe('single');
    });

    it('should handle empty string', () => {
      expect(reverseLines('')).toBe('');
    });
  });

  describe('removeEmptyLines', () => {
    it('should remove empty lines', () => {
      const input = 'hello\n\nworld\n\n';
      expect(removeEmptyLines(input)).toBe('hello\nworld');
    });

    it('should handle lines with only whitespace', () => {
      const input = 'hello\n   \nworld';
      expect(removeEmptyLines(input)).toBe('hello\nworld');
    });

    it('should handle no empty lines', () => {
      expect(removeEmptyLines('hello\nworld')).toBe('hello\nworld');
    });
  });

  describe('removeLinesContaining', () => {
    it('should remove lines containing pattern', () => {
      const input = 'apple\nbanana\napricot';
      expect(removeLinesContaining(input, 'ap')).toBe('banana');
    });

    it('should keep lines not containing pattern', () => {
      const input = 'hello\nworld';
      expect(removeLinesContaining(input, 'foo')).toBe('hello\nworld');
    });
  });

  describe('removeAllSpaces', () => {
    it('should remove all whitespace', () => {
      expect(removeAllSpaces('hello world')).toBe('helloworld');
    });

    it('should handle newlines and tabs', () => {
      expect(removeAllSpaces('hello\n\tworld')).toBe('helloworld');
    });

    it('should handle already no spaces', () => {
      expect(removeAllSpaces('helloworld')).toBe('helloworld');
    });
  });
});