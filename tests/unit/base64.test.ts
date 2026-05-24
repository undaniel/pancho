import { describe, it, expect } from '@jest/globals';
import { encode, decode } from '../../src/transforms/webDev/base64';

describe('base64.ts', () => {
  describe('encode', () => {
    it('should encode basic string to base64', () => {
      const result = encode('hello');
      expect(result.result).toBe('aGVsbG8=');
    });

    it('should encode longer string', () => {
      const result = encode('hello world');
      expect(result.result).toBe('aGVsbG8gd29ybGQ=');
    });

    it('should encode with special characters', () => {
      const result = encode('hello world!');
      expect(result.result).toBe('aGVsbG8gd29ybGQh');
    });
  });

  describe('decode', () => {
    it('should decode base64 to string', () => {
      const result = decode('aGVsbG8=');
      expect(result.result).toBe('hello');
      expect(result.error).toBeUndefined();
    });

    it('should handle valid base64 without error', () => {
      const result = decode('aGVsbG8gd29ybGQ=');
      expect(result.result).toBe('hello world');
      expect(result.error).toBeUndefined();
    });

    it('should detect potentially invalid base64', () => {
      const result = decode('notvalidbase64!');
      expect(result.result).toBeDefined();
    });
  });
});