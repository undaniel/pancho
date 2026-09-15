import { describe, it, expect } from '@jest/globals';
import { csvToJSON, jsonToCSV, csvToTSV, tsvToCSV, csvToMarkdown, markdownTableToCSV } from '../../src/transforms/convert';

describe('convert', () => {
  it('converts CSV to JSON and back', () => {
    const json = csvToJSON('a,b\n1,2').result;
    expect(JSON.parse(json)).toEqual([{ a: '1', b: '2' }]);
    expect(jsonToCSV('[{"a":"1","b":"2"}]').result).toBe('a,b\n1,2');
  });

  it('reports invalid JSON', () => {
    expect(jsonToCSV('nope').error).toBeTruthy();
  });

  it('converts CSV to TSV and back', () => {
    expect(csvToTSV('a,b\n1,2')).toBe('a\tb\n1\t2');
    expect(tsvToCSV('a\tb')).toBe('a,b');
  });

  it('converts CSV to a markdown table', () => {
    const lines = (csvToMarkdown('a,bb\n1,2').result as string).split('\n');
    expect(lines[0]).toBe('| a | bb |');
    expect(lines[1]).toBe('| - | -- |');
    expect(lines[2]).toBe('| 1 | 2  |');
  });

  it('converts a markdown table back to CSV', () => {
    const table = '| a | b |\n| --- | --- |\n| 1 | 2 |';
    expect(markdownTableToCSV(table).result).toBe('a,b\n1,2');
  });

  it('reports a non-table input', () => {
    expect(markdownTableToCSV('nope').error).toBeTruthy();
  });
});
