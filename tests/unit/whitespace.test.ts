import { describe, it, expect } from '@jest/globals';
import { cleanWhitespace } from '../../src/transforms/whitespace';

describe('whitespace.ts', () => {
  describe('cleanWhitespace', () => {
    it('should replace multiple spaces with single space', () => {
      expect(cleanWhitespace('hello    world')).toBe('hello world');
    });

    it('should replace tabs with single space', () => {
      expect(cleanWhitespace('hello\t\tworld')).toBe('hello world');
    });

    it('should trim leading whitespace on each line', () => {
      const input = '  hello\n  world';
      expect(cleanWhitespace(input)).toBe('hello\nworld');
    });

    it('should trim trailing whitespace on each line', () => {
      const input = 'hello  \nworld  ';
      expect(cleanWhitespace(input)).toBe('hello\nworld');
    });

    it('should reduce multiple newlines to double newline', () => {
      const input = 'hello\n\n\n\nworld';
      expect(cleanWhitespace(input)).toBe('hello\n\nworld');
    });

    it('should handle complex input', () => {
      const input = '  hello    world  \n\n\n  foo  \n  bar  ';
      expect(cleanWhitespace(input)).toBe('hello world\n\nfoo\nbar');
    });

    it('should handle empty string', () => {
      expect(cleanWhitespace('')).toBe('');
    });
  });
});