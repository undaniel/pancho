import { describe, it, expect } from '@jest/globals';
import { minify as minifyJSON, prettify as prettifyJSON } from '../../src/transforms/webDev/json';
import { minify as minifyHTML, prettify as prettifyHTML } from '../../src/transforms/webDev/html';
import { minify as minifyCSS, prettify as prettifyCSS } from '../../src/transforms/webDev/css';
import { minify as minifyJS, prettify as prettifyJS } from '../../src/transforms/webDev/js';
import { prettify as prettifyXML, minify as minifyXML } from '../../src/transforms/programmer/xml';

describe('json formatter', () => {
  it('minifies and prettifies JSON', () => {
    expect(minifyJSON('{ "a": 1 }').result).toBe('{"a":1}');
    expect(prettifyJSON('{"a":1}').result).toBe('{\n  "a": 1\n}');
  });

  it('reports invalid JSON', () => {
    expect(minifyJSON('nope').error).toBeTruthy();
  });
});

describe('html formatter', () => {
  it('minifies HTML', () => {
    expect(minifyHTML('<p>  <b>x</b>  </p>')).toBe('<p><b>x</b></p>');
  });

  it('prettifies HTML with indentation', () => {
    const result = prettifyHTML('<div><p>x</p></div>');
    expect(result.split('\n')[0]).toBe('<div>');
    expect(result).toContain('  <p>x</p>');
  });
});

describe('css formatter', () => {
  it('minifies CSS', () => {
    expect(minifyCSS('a { color : red ; }')).toBe('a{color:red}');
  });

  it('prettifies CSS', () => {
    expect(prettifyCSS('a{color:red}')).toContain('color:red');
  });
});

describe('js formatter', () => {
  it('minifies JS', () => {
    expect(minifyJS('function f() { return 1 ; }')).toBe('function f(){return 1;}');
  });

  it('prettifies JS with indentation', () => {
    expect(prettifyJS('function f(){return 1;}')).toContain('\n');
  });
});

describe('xml formatter', () => {
  it('prettifies XML with indentation', () => {
    const result = prettifyXML('<a><b>x</b></a>');
    expect(result.split('\n')[0]).toBe('<a>');
    expect(result).toContain('  <b>x</b>');
  });

  it('minifies XML', () => {
    expect(minifyXML('<a>  <b> x </b> </a>')).toBe('<a><b> x </b></a>');
  });
});
