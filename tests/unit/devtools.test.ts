import { describe, it, expect } from '@jest/globals';
import { timestampToISO, isoToTimestamp, nowAsTimestamp } from '../../src/transforms/timestamp';
import { colorInfo } from '../../src/transforms/colorInfo';
import { hexToRgb, rgbToHex } from '../../src/transforms/webDev/colors';
import { decodeJWT } from '../../src/transforms/jwt';
import { toBinary, fromBinary, toHex, fromHex } from '../../src/transforms/programmer/converters';
import { hashMD5, hashSHA256 } from '../../src/transforms/programmer/hashing';
import { formatSQL } from '../../src/transforms/programmer/sql';

describe('timestamp', () => {
  it('converts seconds and milliseconds to ISO', () => {
    expect(timestampToISO('0').result.startsWith('1970-01-01T00:00:00.000Z')).toBe(true);
    expect(timestampToISO('abc').error).toBe('Not a number');
  });

  it('converts ISO to a timestamp', () => {
    expect(isoToTimestamp('1970-01-01T00:00:00.000Z').result).toBe('0 (s) | 0 (ms)');
    expect(isoToTimestamp('not a date').error).toBeTruthy();
  });

  it('produces a current timestamp', () => {
    expect(nowAsTimestamp()).toContain('(s)');
  });
});

describe('colorInfo', () => {
  it('reports HEX, RGB and HSL for a hex color', () => {
    const result = colorInfo('#ff0000').result;
    expect(result).toContain('HEX: #ff0000');
    expect(result).toContain('RGB: rgb(255, 0, 0)');
    expect(result).toContain('HSL: hsl(0, 100%, 50%)');
  });

  it('accepts rgb() input', () => {
    expect(colorInfo('rgb(0, 255, 0)').result).toContain('HEX: #00ff00');
  });

  it('rejects invalid colors', () => {
    expect(colorInfo('nope').error).toBeTruthy();
  });

  it('converts hex and rgb', () => {
    expect(hexToRgb('#336699').result).toBe('rgb(51, 102, 153)');
    expect(rgbToHex('rgb(51, 102, 153)').result).toBe('#336699');
    expect(hexToRgb('zzz').error).toBeTruthy();
    expect(rgbToHex('rgb(300, 0, 0)').error).toBeTruthy();
  });
});

describe('jwt', () => {
  const b64url = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  it('decodes header and payload', () => {
    const token = `${b64url({ alg: 'HS256' })}.${b64url({ sub: '123' })}.sig`;
    const result = decodeJWT(token);
    expect(result.error).toBeUndefined();
    const parsed = JSON.parse(result.result);
    expect(parsed.header.alg).toBe('HS256');
    expect(parsed.payload.sub).toBe('123');
    expect(parsed.signature).toBe('sig');
  });

  it('flags expired tokens', () => {
    const token = `${b64url({ alg: 'none' })}.${b64url({ exp: 1 })}.`;
    const parsed = JSON.parse(decodeJWT(token).result);
    expect(parsed.expired).toBe(true);
  });

  it('rejects malformed tokens', () => {
    expect(decodeJWT('nope').error).toBeTruthy();
  });
});

describe('programmer converters', () => {
  it('converts text to binary and back', () => {
    expect(toBinary('A').result).toBe('01000001');
    expect(fromBinary('01000001 01000010').result).toBe('AB');
    expect(fromBinary('2').error).toBeTruthy();
  });

  it('converts text to hex and back', () => {
    expect(toHex('A').result).toBe('41');
    expect(fromHex('41').result).toBe('A');
  });

  it('hashes with MD5 and SHA-256', () => {
    expect(hashMD5('').result).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(hashMD5('').warning).toBeTruthy();
    expect(hashSHA256('').result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('formats SQL with newlines', () => {
    const formatted = formatSQL('select a, b from t where x = 1');
    expect(formatted).toContain('SELECT');
    expect(formatted).toContain('FROM');
    expect(formatted.split('\n').length).toBeGreaterThan(1);
  });
});
