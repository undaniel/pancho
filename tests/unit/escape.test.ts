import { describe, it, expect } from '@jest/globals';
import {
  escapeJSON,
  unescapeJSON,
  escapeForSQL,
  unescapeForSQL,
  escapeForRegex,
  escapeForHTML,
  unescapeForHTML,
} from '../../src/transforms/escape';

describe('escape.ts', () => {
  describe('escapeJSON', () => {
    it('should escape JSON string', () => {
      expect(escapeJSON('hello')).toBe('"hello"');
    });

    it('should escape quotes', () => {
      expect(escapeJSON('hello "world"')).toBe('"hello \\"world\\""');
    });

    it('should escape newlines', () => {
      expect(escapeJSON('hello\nworld')).toBe('"hello\\nworld"');
    });
  });

  describe('unescapeJSON', () => {
    it('should unescape JSON string', () => {
      const result = unescapeJSON('"hello"');
      expect(result.result).toBe('hello');
      expect(result.error).toBeUndefined();
    });

    it('should handle invalid JSON', () => {
      const result = unescapeJSON('not json');
      expect(result.result).toBe('not json');
      expect(result.error).toBeDefined();
    });
  });

  describe('escapeForSQL', () => {
    it('should escape single quotes', () => {
      expect(escapeForSQL("hello'world")).toBe("hello''world");
    });

    it('should escape multiple single quotes', () => {
      expect(escapeForSQL("it's a test")).toBe("it''s a test");
    });

    it('should handle string without quotes', () => {
      expect(escapeForSQL('hello world')).toBe('hello world');
    });
  });

  describe('unescapeForSQL', () => {
    it('should unescape double single quotes', () => {
      expect(unescapeForSQL("hello''world")).toBe("hello'world");
    });

    it('should handle string without escaped quotes', () => {
      expect(unescapeForSQL('hello world')).toBe('hello world');
    });
  });

  describe('escapeForRegex', () => {
    it('should escape special regex characters', () => {
      expect(escapeForRegex('hello.world')).toBe('hello\\.world');
    });

    it('should escape all special characters', () => {
      expect(escapeForRegex('a.b+c*d?')).toBe('a\\.b\\+c\\*d\\?');
    });

    it('should not escape regular characters', () => {
      expect(escapeForRegex('hello')).toBe('hello');
    });
  });

  describe('escapeForHTML', () => {
    it('should escape ampersand', () => {
      expect(escapeForHTML('AT&T')).toBe('AT&amp;T');
    });

    it('should escape less than', () => {
      expect(escapeForHTML('a < b')).toBe('a &lt; b');
    });

    it('should escape greater than', () => {
      expect(escapeForHTML('a > b')).toBe('a &gt; b');
    });

    it('should escape quotes', () => {
      expect(escapeForHTML('"hello"')).toBe('&quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeForHTML("it's")).toBe('it&#39;s');
    });

    it('should escape all special characters', () => {
      expect(escapeForHTML('<tag attr="value">')).toBe('&lt;tag attr=&quot;value&quot;&gt;');
    });
  });

  describe('unescapeForHTML', () => {
    it('should unescape ampersand', () => {
      const result = unescapeForHTML('AT&amp;T');
      expect(result.result).toBe('AT&T');
    });

    it('should unescape less than', () => {
      const result = unescapeForHTML('a &lt; b');
      expect(result.result).toBe('a < b');
    });

    it('should unescape greater than', () => {
      const result = unescapeForHTML('a &gt; b');
      expect(result.result).toBe('a > b');
    });

    it('should unescape quotes', () => {
      const result = unescapeForHTML('&quot;hello&quot;');
      expect(result.result).toBe('"hello"');
    });

    it('should unescape single quotes', () => {
      const result = unescapeForHTML('it&#39;s');
      expect(result.result).toBe("it's");
    });
  });
});