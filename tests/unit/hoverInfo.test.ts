import { describe, it, expect } from '@jest/globals';
import { buildHover, findHoverCandidate, tryDecodeBase64 } from '../../src/transforms/hoverInfo';

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const BASE64 = 'aGVsbG8gd29ybGQgdGhpcyBpcyBhIHRlc3Q=';

describe('findHoverCandidate', () => {
  it('finds a JWT under the cursor', () => {
    const line = `token = ${JWT}`;
    const candidate = findHoverCandidate(line, 15);
    expect(candidate?.token).toBe(JWT);
  });

  it('finds a hex color', () => {
    expect(findHoverCandidate('color: #ff0000;', 8)?.token).toBe('#ff0000');
  });

  it('finds a 10-digit timestamp', () => {
    expect(findHoverCandidate('t=1700000000', 5)?.token).toBe('1700000000');
  });

  it('finds a base64 blob', () => {
    expect(findHoverCandidate(`data ${BASE64} end`, 10)?.token).toBe(BASE64);
  });

  it('returns null when the cursor is outside any token', () => {
    expect(findHoverCandidate('plain text here', 2)).toBeNull();
  });
});

describe('buildHover', () => {
  it('decodes JWTs', () => {
    const info = buildHover(JWT);
    expect(info?.kind).toBe('jwt');
    expect(info?.lines.join('\n')).toContain('"alg"');
  });

  it('describes colors', () => {
    const info = buildHover('#ff0000');
    expect(info?.kind).toBe('color');
    expect(info?.lines.join('\n')).toContain('rgb(255, 0, 0)');
  });

  it('converts timestamps', () => {
    const info = buildHover('1700000000');
    expect(info?.kind).toBe('timestamp');
    expect(info?.lines.join('\n')).toContain('2023-11-14');
  });

  it('decodes printable base64', () => {
    const info = buildHover(BASE64);
    expect(info?.kind).toBe('base64');
    expect(info?.lines.join('\n')).toContain('hello world');
  });

  it('returns null for unrelated text', () => {
    expect(buildHover('just some words')).toBeNull();
  });
});

describe('tryDecodeBase64', () => {
  it('rejects non printable payloads', () => {
    expect(tryDecodeBase64('////////////')).toBeNull();
  });

  it('accepts printable payloads', () => {
    expect(tryDecodeBase64(BASE64)).toBe('hello world this is a test');
  });
});
