import { describe, it, expect } from '@jest/globals';
import { toBinary, fromBinary, toHex, fromHex } from '../../src/transforms/programmer/converters';

describe('converters.ts', () => {
  describe('toBinary', () => {
    it('should convert text to binary', () => {
      const result = toBinary('A');
      expect(result.result).toBe('01000001');
    });

    it('should convert multiple characters', () => {
      const result = toBinary('AB');
      expect(result.result).toBe('01000001 01000010');
    });

    it('should handle lowercase letters', () => {
      const result = toBinary('a');
      expect(result.result).toBe('01100001');
    });
  });

  describe('fromBinary', () => {
    it('should convert binary to text', () => {
      const result = fromBinary('01000001');
      expect(result.result).toBe('A');
      expect(result.error).toBeUndefined();
    });

    it('should convert multiple bytes', () => {
      const result = fromBinary('01000001 01000010');
      expect(result.result).toBe('AB');
    });

    it('should return error for invalid binary', () => {
      const result = fromBinary('invalid');
      expect(result.error).toBeDefined();
    });
  });

  describe('toHex', () => {
    it('should convert text to hex', () => {
      const result = toHex('A');
      expect(result.result).toBe('41');
    });

    it('should convert multiple characters', () => {
      const result = toHex('AB');
      expect(result.result).toBe('41 42');
    });

    it('should handle lowercase letters', () => {
      const result = toHex('a');
      expect(result.result).toBe('61');
    });
  });

  describe('fromHex', () => {
    it('should convert hex to text', () => {
      const result = fromHex('41');
      expect(result.result).toBe('A');
      expect(result.error).toBeUndefined();
    });

    it('should convert multiple hex values', () => {
      const result = fromHex('4142');
      expect(result.result).toBe('AB');
    });

    it('should return error for invalid hex', () => {
      const result = fromHex('GG');
      expect(result.error).toBeDefined();
    });
  });
});