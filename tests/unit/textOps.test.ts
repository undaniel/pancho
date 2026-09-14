import { describe, it, expect } from '@jest/globals';
import { toWindowsEOL, toUnixEOL, toMacEOL } from '../../src/transforms/eol';
import { trimLines } from '../../src/transforms/lineUtils';
import { removeDiacritics, stripHTMLTags, wrapText, unwrapText } from '../../src/transforms/text';
import { transposeCharacters, transposeWords, transposeLines } from '../../src/transforms/transpose';
import { pasteWithoutLineBreak, copyToMultipleLines, formatAsCSV } from '../../src/transforms/specialPaste';
import { alignByChar, alignEquals, alignColons } from '../../src/transforms/align';

describe('eol', () => {
  it('converts to CRLF, LF and CR', () => {
    expect(toWindowsEOL('a\nb\rc')).toBe('a\r\nb\r\nc');
    expect(toUnixEOL('a\r\nb\rc')).toBe('a\nb\nc');
    expect(toMacEOL('a\nb\r\nc')).toBe('a\rb\rc');
  });
});

describe('trimLines', () => {
  it('trims every line', () => {
    expect(trimLines('  a  \n b ')).toBe('a\nb');
  });
});

describe('text helpers', () => {
  it('removes diacritics', () => {
    expect(removeDiacritics('café')).toBe('cafe');
    expect(removeDiacritics('niño')).toBe('nino');
  });

  it('strips HTML tags and collapses whitespace', () => {
    expect(stripHTMLTags('<p>hi <b>there</b></p>')).toBe('hi there');
  });

  it('wraps text at a width', () => {
    expect(wrapText('aaa bbb ccc', 7)).toBe('aaa bbb\nccc');
    expect(wrapText('x', 0)).toBe('x');
  });

  it('unwraps single line breaks but keeps blank lines', () => {
    expect(unwrapText('a\nb\n\nc')).toBe('a b\n\nc');
  });
});

describe('transpose', () => {
  it('transposes the last two characters', () => {
    expect(transposeCharacters('abc')).toBe('acb');
    expect(transposeCharacters('a')).toBe('a');
  });

  it('transposes the last two words', () => {
    expect(transposeWords('one two')).toBe('two one');
  });

  it('transposes the last two lines', () => {
    expect(transposeLines('a\nb\nc')).toBe('a\nc\nb');
  });
});

describe('specialPaste', () => {
  it('pastes without line breaks', () => {
    expect(pasteWithoutLineBreak('a\nb\r\nc')).toBe('a b c');
  });

  it('copies content to multiple lines', () => {
    expect(copyToMultipleLines('x', 3)).toBe('x\nx\nx');
  });

  it('formats tab-separated values as CSV', () => {
    expect(formatAsCSV('a\tb')).toBe('a,b');
    expect(formatAsCSV('a,b\tc')).toBe('"a,b",c');
  });
});

describe('align', () => {
  it('aligns by equals and colons', () => {
    expect(alignEquals('a=1\nbb=2').result).toBe('a =1\nbb=2');
    expect(alignColons('a:1\nbb:2').result).toBe('a :1\nbb:2');
  });

  it('requires a character', () => {
    expect(alignByChar('a=b', '').error).toBeTruthy();
  });

  it('returns text unchanged for a single line', () => {
    expect(alignEquals('a=1').result).toBe('a=1');
  });
});
