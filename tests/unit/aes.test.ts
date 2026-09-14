import { describe, it, expect } from '@jest/globals';
import * as crypto from 'crypto';
import { aesEncrypt, aesDecrypt } from '../../src/transforms/aes';

const V2_PREFIX = 'PANCHO-AES2:';

describe('aes', () => {
  it('encrypts with the v2 prefix and decrypts back', () => {
    const encrypted = aesEncrypt('secret message', 'pw');
    expect(encrypted.error).toBeUndefined();
    expect(encrypted.result.startsWith(V2_PREFIX)).toBe(true);
    expect(aesDecrypt(encrypted.result, 'pw').result).toBe('secret message');
  });

  it('uses a random salt so ciphertext differs each time', () => {
    expect(aesEncrypt('same', 'pw').result).not.toBe(aesEncrypt('same', 'pw').result);
  });

  it('fails to decrypt with the wrong password', () => {
    const encrypted = aesEncrypt('secret', 'right');
    expect(aesDecrypt(encrypted.result, 'wrong').error).toBeTruthy();
  });

  it('detects tampering via authentication tag', () => {
    const encrypted = aesEncrypt('secret', 'pw');
    const payload = Buffer.from(encrypted.result.slice(V2_PREFIX.length), 'base64');
    payload[payload.length - 1] ^= 0x01;
    const tampered = V2_PREFIX + payload.toString('base64');
    expect(aesDecrypt(tampered, 'pw').error).toBeTruthy();
  });

  it('still decrypts legacy CBC data', () => {
    const key = crypto.pbkdf2Sync('pw', 'pancho-static-salt-v1', 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const ciphertext = Buffer.concat([cipher.update('legacy text', 'utf-8'), cipher.final()]);
    const legacy = iv.toString('hex') + ':' + ciphertext.toString('hex');
    expect(aesDecrypt(legacy, 'pw').result).toBe('legacy text');
  });

  it('requires a password', () => {
    expect(aesEncrypt('x', '').error).toBeTruthy();
    expect(aesDecrypt('x', '').error).toBeTruthy();
  });

  it('rejects malformed v2 payloads', () => {
    expect(aesDecrypt(V2_PREFIX + 'AAAA', 'pw').error).toBeTruthy();
  });
});
