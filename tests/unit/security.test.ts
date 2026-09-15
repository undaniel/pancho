import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.join(__dirname, '..', '..', 'src');

const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /\bchild_process\b/, label: 'child_process' },
  { pattern: /\beval\s*\(/, label: 'eval()' },
  { pattern: /new\s+Function\s*\(/, label: 'new Function()' },
  { pattern: /require\(\s*['"](?:http|https|net|dgram|dns|tls)['"]\s*\)/, label: 'network module' },
  { pattern: /\bfetch\s*\(/, label: 'fetch()' },
  { pattern: /\bXMLHttpRequest\b/, label: 'XMLHttpRequest' },
];

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

describe('security invariants', () => {
  const files = walk(SRC_DIR);

  it('has source files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const { pattern, label } of FORBIDDEN) {
    it(`does not use ${label}`, () => {
      const offenders = files.filter(file => pattern.test(fs.readFileSync(file, 'utf8')));
      expect(offenders).toEqual([]);
    });
  }
});
