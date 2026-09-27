import { describe, it, expect, beforeEach } from '@jest/globals';
import * as vscode from 'vscode';
import * as path from 'path';
import { registerMenuCommands, buildCategories } from '../../src/commands/menu';

const mock = vscode as unknown as {
  __reset(): void;
  __getCommandHandler(id: string): ((...args: unknown[]) => unknown) | undefined;
  window: { showQuickPick: jest.Mock };
  command: unknown;
  commands: { executeCommand: jest.Mock };
  extensions: { getExtension: jest.Mock };
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');

function makeContext() {
  const store: Record<string, unknown> = {};
  return {
    extensionPath: path.join(__dirname, '..', '..'),
    subscriptions: { push: () => {} },
    globalState: {
      get: (key: string, def: unknown) => (key in store ? store[key] : def),
      update: async (key: string, value: unknown) => {
        store[key] = value;
      },
    },
    workspaceState: { get: () => undefined, update: async () => {} },
    _store: store,
  } as unknown as vscode.ExtensionContext & { _store: Record<string, unknown> };
}

describe('favorites flow', () => {
  beforeEach(() => {
    mock.__reset();
    mock.commands.executeCommand.mockClear();
    mock.extensions.getExtension.mockReturnValue({ packageJSON: pkg });
  });

  it('lists the line-endings command in the favorites catalogue', () => {
    const categories = buildCategories(pkg as never, require('../../package.nls.json'));
    const flat = categories.flatMap(c => c.entries);
    expect(flat.some(e => e.command === 'pancho.lineEndingsToSpaces')).toBe(true);
  });

  it('saves and then executes a favorite', async () => {
    const context = makeContext();
    registerMenuCommands(context);

    mock.window.showQuickPick.mockResolvedValueOnce([
      { label: 'Convert line endings to spaces', command: 'pancho.lineEndingsToSpaces' },
    ]);
    await mock.__getCommandHandler('pancho.toggleFavorite')!();
    expect(context._store['pancho.favoriteCommands']).toEqual(['pancho.lineEndingsToSpaces']);

    mock.window.showQuickPick.mockImplementationOnce(async (items: Array<{ command?: string }>) =>
      items.find(i => i.command === 'pancho.lineEndingsToSpaces')
    );
    await mock.__getCommandHandler('pancho.showFavorites')!();
    expect(mock.commands.executeCommand).toHaveBeenCalledWith('pancho.lineEndingsToSpaces');
  });
});
