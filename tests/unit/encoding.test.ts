import { describe, it, expect } from '@jest/globals';
import { detectEncoding, isValidUtf8 } from '../../src/features/encoding';

const bytes = (...values: number[]) => Uint8Array.from(values);

describe('detectEncoding', () => {
  it('detects UTF-8 with BOM', () => {
    expect(detectEncoding(bytes(0xef, 0xbb, 0xbf, 0x41))).toEqual({ encoding: 'UTF-8', bom: true });
  });

  it('detects UTF-16 LE with BOM', () => {
    expect(detectEncoding(bytes(0xff, 0xfe, 0x41, 0x00))).toEqual({ encoding: 'UTF-16 LE', bom: true });
  });

  it('detects UTF-16 BE with BOM', () => {
    expect(detectEncoding(bytes(0xfe, 0xff, 0x00, 0x41))).toEqual({ encoding: 'UTF-16 BE', bom: true });
  });

  it('detects plain ASCII as UTF-8 without BOM', () => {
    expect(detectEncoding(bytes(0x68, 0x69))).toEqual({ encoding: 'UTF-8', bom: false });
  });

  it('detects valid multi-byte UTF-8 without BOM', () => {
    expect(detectEncoding(bytes(0xc3, 0xa9))).toEqual({ encoding: 'UTF-8', bom: false });
  });

  it('falls back to Latin-1 for invalid UTF-8', () => {
    expect(detectEncoding(bytes(0xe9))).toEqual({ encoding: 'Latin-1 (ANSI)', bom: false });
  });
});

describe('isValidUtf8', () => {
  it('accepts valid sequences', () => {
    expect(isValidUtf8(bytes(0x41, 0xc3, 0xa9, 0xe2, 0x82, 0xac))).toBe(true);
  });

  it('rejects truncated sequences', () => {
    expect(isValidUtf8(bytes(0xe2, 0x82))).toBe(false);
  });
});
