import { describe, it, expect } from '@jest/globals';
import { detectContent } from '../../src/transforms/detectContent';

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('detectContent', () => {
  it('detects JSON objects', () => {
    expect(detectContent('{"a": 1, "b": [2, 3]}')).toContain('json');
  });

  it('detects CSV', () => {
    expect(detectContent('name,age\nana,30\nluis,25')).toContain('csv');
  });

  it('detects JWTs', () => {
    expect(detectContent(JWT)).toContain('jwt');
  });

  it('detects colors', () => {
    expect(detectContent('#ff0000')).toContain('color');
  });

  it('detects timestamps', () => {
    expect(detectContent('1700000000')).toContain('timestamp');
  });

  it('detects base64', () => {
    expect(detectContent('aGVsbG8gd29ybGQgdGhpcyBpcyBhIHRlc3Q=')).toContain('base64');
  });

  it('returns nothing for plain prose', () => {
    expect(detectContent('this is just a sentence')).toEqual([]);
  });

  it('ignores empty input', () => {
    expect(detectContent('   ')).toEqual([]);
  });
});
