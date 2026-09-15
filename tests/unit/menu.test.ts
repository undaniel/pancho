import { describe, it, expect } from '@jest/globals';
import { buildCategories } from '../../src/commands/menu';

const manifest = {
  contributes: {
    commands: [
      { command: 'pancho.toUpperCase', title: '%command.pancho.toUpperCase.title%' },
      { command: 'pancho.toLowerCase', title: '%command.pancho.toLowerCase.title%' },
    ],
    submenus: [{ id: 'panchoCaso', label: '%submenu.panchoCaso.label%' }],
    keybindings: [{ command: 'pancho.toUpperCase', key: 'ctrl+shift+u', mac: 'cmd+shift+u' }],
    menus: {
      panchoMenu: [{ submenu: 'panchoCaso' }],
      panchoCaso: [{ command: 'pancho.toUpperCase' }, { command: 'pancho.toLowerCase' }, { separator: 'before' }],
    },
  },
};

const nls: Record<string, string> = {
  'command.pancho.toUpperCase.title': 'Convert to UPPERCASE',
  'command.pancho.toLowerCase.title': 'Convert to lowercase',
  'submenu.panchoCaso.label': 'Case',
};

describe('buildCategories', () => {
  it('builds categories with localized titles and keybindings', () => {
    const categories = buildCategories(manifest as never, nls);
    expect(categories).toHaveLength(1);
    expect(categories[0].label).toBe('Case');
    expect(categories[0].entries).toHaveLength(2);
    expect(categories[0].entries[0].title).toBe('Convert to UPPERCASE');
    expect(categories[0].entries[0].keybinding).toBe('cmd+shift+u');
  });

  it('keeps unresolved keys when the nls entry is missing', () => {
    const categories = buildCategories(manifest as never, {});
    expect(categories[0].entries[0].title).toBe('%command.pancho.toUpperCase.title%');
  });

  it('returns an empty list without a manifest', () => {
    expect(buildCategories(undefined, {})).toEqual([]);
  });
});
