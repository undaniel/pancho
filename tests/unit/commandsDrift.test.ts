import { describe, it, expect } from '@jest/globals';
import { Commands } from '../../src/commands/registry';

/**
 * Drift guard: keeps the runtime command registry and the `contributes.commands`
 * manifest in package.json from silently diverging.
 */
interface ContributionEntry {
  command: string;
}

const pkg = require('../../package.json') as {
  contributes?: { commands?: ContributionEntry[] };
};

const declared: string[] = (pkg.contributes?.commands ?? []).map(entry => entry.command);
const registered: string[] = Object.values(Commands);

describe('command registry drift guard', () => {
  it('reads a non-empty commands manifest', () => {
    expect(declared.length).toBeGreaterThan(0);
  });

  it('registers a non-empty set of Commands', () => {
    expect(registered.length).toBeGreaterThan(0);
  });

  it('declares every registered command in package.json', () => {
    const missing = registered.filter(command => !declared.includes(command));
    expect(missing).toEqual([]);
  });

  it('does not declare duplicate commands', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const command of declared) {
      if (seen.has(command)) duplicates.push(command);
      seen.add(command);
    }
    expect(duplicates).toEqual([]);
  });

  it('declares pancho.showStatusInfo', () => {
    expect(declared).toContain('pancho.showStatusInfo');
  });

  it('only declares commands in the pancho.* namespace', () => {
    const offenders = declared.filter(command => !command.startsWith('pancho.'));
    expect(offenders).toEqual([]);
  });
});
