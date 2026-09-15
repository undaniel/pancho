import { describe, it, expect } from '@jest/globals';
import {
  toSentenceCase,
  invertCase,
  randomCase,
  toKebabCase,
  toSnakeCase,
  toCamelCase,
  toPascalCase,
  toConstantCase,
} from '../../src/transforms/case';

describe('case transforms', () => {
  it('converts to sentence case', () => {
    expect(toSentenceCase('hello world. again')).toBe('Hello world. Again');
  });

  it('inverts case', () => {
    expect(invertCase('aB')).toBe('Ab');
  });

  it('randomizes case without changing letters', () => {
    const value = randomCase('abcdef');
    expect(value).toHaveLength(6);
    expect(value.toLowerCase()).toBe('abcdef');
  });

  it('converts between naming conventions', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
    expect(toCamelCase('Hello World')).toBe('helloWorld');
    expect(toPascalCase('hello world')).toBe('HelloWorld');
    expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
  });
});
