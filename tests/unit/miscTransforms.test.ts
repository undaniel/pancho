import { describe, it, expect } from '@jest/globals';
import { cleanLineEndings, lineEndingsToSpaces } from '../../src/transforms/lineEndings';
import { removeConsecutiveDuplicateLines, removeEmptyLines, moveLineUp, moveLineDown } from '../../src/transforms/lines';
import { sortByLength, sortByLengthDescending, sortNumeric } from '../../src/transforms/sort';
import { generateUUID, generateRandomString } from '../../src/transforms/programmer/generators';
import { generateLoremIpsum } from '../../src/transforms/webDev/loremIpsum';
import { encode as urlEncode, decode as urlDecode } from '../../src/transforms/webDev/urlCodec';
import { encode as htmlEncode, decode as htmlDecode } from '../../src/transforms/webDev/htmlEntities';
import { encode as base64Encode, decode as base64Decode } from '../../src/transforms/webDev/base64';

describe('lineEndings', () => {
  it('normalizes line endings and strips control chars', () => {
    expect(cleanLineEndings('a\r\nb\rc\n\x07d')).toBe('a\nb\nc\nd');
  });

  it('converts line endings to spaces', () => {
    expect(lineEndingsToSpaces('a\nb\rc')).toBe('a b c');
  });
});

describe('line utilities', () => {
  it('removes consecutive duplicates', () => {
    expect(removeConsecutiveDuplicateLines('a\na\nb\nb\na')).toBe('a\nb\na');
  });

  it('removes empty lines', () => {
    expect(removeEmptyLines('a\n\n b \n')).toBe('a\n b ');
  });

  it('moves lines up and down', () => {
    expect(moveLineUp('a\nb\nc', 1)).toBe('b\na\nc');
    expect(moveLineDown('a\nb\nc', 0)).toBe('b\na\nc');
    expect(moveLineUp('a\nb', 0)).toBe('a\nb');
  });
});

describe('sort extra', () => {
  it('sorts by length and numerically', () => {
    expect(sortByLength('ccc\na\nbb')).toBe('a\nbb\nccc');
    expect(sortByLengthDescending('a\nccc\nbb')).toBe('ccc\nbb\na');
    expect(sortNumeric('10\n2\n1')).toBe('1\n2\n10');
  });
});

describe('generators', () => {
  it('generates a UUID', () => {
    expect(generateUUID()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('generates a random string with the requested length', () => {
    expect(generateRandomString(8)).toHaveLength(8);
    expect(generateRandomString(8)).toMatch(/^[A-Za-z0-9]+$/);
    expect(generateRandomString(999999)).toHaveLength(10000);
  });

  it('generates lorem ipsum and clamps the word count', () => {
    expect(generateLoremIpsum(5).split(' ')).toHaveLength(5);
    expect(generateLoremIpsum(0).split(' ')).toHaveLength(1);
  });
});

describe('web codecs', () => {
  it('encodes and decodes URLs', () => {
    expect(urlEncode('a b&c')).toBe('a%20b%26c');
    expect(urlDecode('a%20b%26c')).toBe('a b&c');
  });

  it('encodes and decodes HTML entities', () => {
    expect(htmlEncode('<a&b>')).toBe('&lt;a&amp;b&gt;');
    expect(htmlDecode('&lt;a&amp;b&gt;')).toBe('<a&b>');
  });

  it('encodes and decodes base64', () => {
    expect(base64Encode('hi').result).toBe('aGk=');
    expect(base64Decode('aGk=').result).toBe('hi');
    expect(base64Decode('!!!').error).toBeTruthy();
  });
});
