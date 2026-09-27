import { describe, it, expect } from '@jest/globals';
import { Commands, commandManifest, Categories } from '../../src/commands/registry';

/**
 * Single-source guard: `contributes.commands` in package.json must be exactly
 * what `npm run commands:sync` generates from `src/commands/registry.ts`, and
 * every menu / keybinding reference must point at a known command.
 */
interface CommandEntry {
  command: string;
  title: string;
  category: string;
  enablement?: string;
}

const pkg = require('../../package.json') as {
  contributes: {
    commands: CommandEntry[];
    menus: Record<string, Array<{ command?: string }>>;
    keybindings?: Array<{ command: string }>;
  };
};

const nlsEn = require('../../package.nls.json') as Record<string, string>;
const nlsEs = require('../../package.nls.es.json') as Record<string, string>;

const declared = pkg.contributes.commands;
const registered: string[] = Object.values(Commands);

const expected: CommandEntry[] = Object.values(commandManifest).map(entry => {
  const generated: CommandEntry = {
    command: entry.id,
    title: `%command.${entry.id}.title%`,
    category: Categories[entry.category],
  };
  if ('enablement' in entry) generated.enablement = entry.enablement;
  return generated;
});

const PALETTE_ONLY = ['pancho.showStatusInfo'];

describe('command manifest (single source)', () => {
  it('generates the manifest from a non-empty registry', () => {
    expect(expected.length).toBeGreaterThan(0);
  });

  it('matches contributes.commands exactly', () => {
    expect(declared).toEqual(expected);
  });

  it('only references known commands from menus', () => {
    const offenders: string[] = [];
    for (const items of Object.values(pkg.contributes.menus)) {
      for (const item of items) {
        if (item.command && !registered.includes(item.command)) offenders.push(item.command);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('only references known commands from keybindings', () => {
    const offenders = (pkg.contributes.keybindings ?? [])
      .map(k => k.command)
      .filter(command => !registered.includes(command));
    expect(offenders).toEqual([]);
  });

  it('places every command in a menu or marks it palette-only', () => {
    const inMenus = new Set<string>();
    for (const items of Object.values(pkg.contributes.menus)) {
      for (const item of items) {
        if (item.command) inMenus.add(item.command);
      }
    }
    const unplaced = registered.filter(
      command => !inMenus.has(command) && !PALETTE_ONLY.includes(command),
    );
    expect(unplaced).toEqual([]);
  });

  it('has an English and Spanish title for every command', () => {
    const missingEn = registered.filter(id => !(`command.${id}.title` in nlsEn));
    const missingEs = registered.filter(id => !(`command.${id}.title` in nlsEs));
    expect(missingEn).toEqual([]);
    expect(missingEs).toEqual([]);
  });
});

describe('documentation assets', () => {
  const raw = require('../../package.json') as {
    contributes: {
      walkthroughs?: Array<{ steps?: Array<{ id?: string; media?: { altText?: string } }> }>;
      views?: Record<string, Array<{ id: string; name: string }>>;
      viewsContainers?: Record<string, Array<{ id: string }>>;
    };
  };

  it('gives every walkthrough step media an altText', () => {
    const missing: string[] = [];
    for (const walkthrough of raw.contributes.walkthroughs ?? []) {
      for (const step of walkthrough.steps ?? []) {
        if (!step.media?.altText) missing.push(step.id ?? '(unnamed step)');
      }
    }
    expect(missing).toEqual([]);
  });

  it('declares every view inside a declared container', () => {
    const containers = new Set((raw.contributes.viewsContainers?.activitybar ?? []).map(c => c.id));
    const orphanViews = Object.keys(raw.contributes.views ?? {}).filter(id => !containers.has(id));
    expect(orphanViews).toEqual([]);
  });
});
