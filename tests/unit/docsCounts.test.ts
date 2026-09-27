import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..', '..');

const pkg = require('../../package.json') as { contributes: { commands: unknown[] } };
const count = pkg.contributes.commands.length;

const DOCS = [
  'README.md',
  'docs/README.es.md',
  'docs/commands.md',
  'docs/commands.es.md',
  'docs/marketplace.md',
];

const COUNT_PATTERN = /\*\*(\d+)( (?:commands|comandos))\*\*/g;
const HAS_COUNT = /\*\*\d+ (?:commands|comandos)\*\*/;

describe('docs command counts', () => {
  it('match the manifest count', () => {
    const mismatches: string[] = [];
    for (const relative of DOCS) {
      const text = fs.readFileSync(path.join(root, relative), 'utf8');
      const pattern = new RegExp(COUNT_PATTERN.source, 'g');
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        if (Number(match[1]) !== count) {
          mismatches.push(`${relative}: "${match[0]}" (expected ${count})`);
        }
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('states the count in every doc', () => {
    const missing = DOCS.filter(relative => !HAS_COUNT.test(fs.readFileSync(path.join(root, relative), 'utf8')));
    expect(missing).toEqual([]);
  });
});
