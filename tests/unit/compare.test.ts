import { describe, it, expect, beforeEach } from '@jest/globals';
import * as vscode from 'vscode';
import { compareWithClipboard } from '../../src/utils/compare';

interface MockApi {
  window: {
    activeTextEditor: unknown;
    showWarningMessage: jest.Mock;
  };
  workspace: { openTextDocument: jest.Mock };
  env: { clipboard: { readText: jest.Mock } };
  commands: { executeCommand: jest.Mock };
  __reset(): void;
  __setConfig(key: string, value: unknown): void;
}

const mock = vscode as unknown as MockApi;

function makeEditor(fullText: string, selectionText: string): vscode.TextEditor {
  const document = {
    getText: (range?: unknown) => (range ? selectionText : fullText),
    languageId: 'plaintext',
    isUntitled: false,
    uri: vscode.Uri.file('/project/demo.txt'),
  };
  return {
    document,
    selection: { isEmpty: selectionText.length === 0 },
  } as unknown as vscode.TextEditor;
}

beforeEach(() => {
  mock.__reset();
  mock.commands.executeCommand.mockClear();
  mock.env.clipboard.readText.mockReset();
  mock.env.clipboard.readText.mockResolvedValue('from-clipboard');
  let sequence = 0;
  mock.workspace.openTextDocument.mockReset();
  mock.workspace.openTextDocument.mockImplementation(async () => ({
    uri: vscode.Uri.parse(`untitled:Untitled-${++sequence}`),
  }));
});

describe('compareWithClipboard', () => {
  it('warns when there is no active editor', async () => {
    mock.window.activeTextEditor = undefined;
    await compareWithClipboard();
    expect(mock.window.showWarningMessage).toHaveBeenCalledWith('Pancho: Open a file to compare.');
    expect(mock.commands.executeCommand).not.toHaveBeenCalledWith(
      'vscode.diff', expect.anything(), expect.anything(), expect.anything()
    );
  });

  it('compares the selection against the clipboard', async () => {
    mock.window.activeTextEditor = makeEditor('full text', 'selected text');
    await compareWithClipboard();

    expect(mock.env.clipboard.readText).toHaveBeenCalled();
    const contents = mock.workspace.openTextDocument.mock.calls.map(call => call[0].content);
    expect(contents).toEqual(['from-clipboard', 'selected text']);

    const call = mock.commands.executeCommand.mock.calls.find(args => args[0] === 'vscode.diff');
    expect(call).toBeDefined();
    expect(call?.[3]).toBe('Pancho: Compare - Clipboard ↔ demo.txt');
  });

  it('falls back to the whole document when nothing is selected', async () => {
    mock.window.activeTextEditor = makeEditor('full text', '');
    await compareWithClipboard();
    const contents = mock.workspace.openTextDocument.mock.calls.map(call => call[0].content);
    expect(contents).toEqual(['from-clipboard', 'full text']);
  });

  it('refuses documents above the size limit', async () => {
    mock.__setConfig('maxFileSizeKB', 1);
    mock.window.activeTextEditor = makeEditor('x'.repeat(2048), '');
    await compareWithClipboard();
    expect(mock.window.showWarningMessage).toHaveBeenCalled();
    expect(mock.commands.executeCommand).not.toHaveBeenCalledWith(
      'vscode.diff', expect.anything(), expect.anything(), expect.anything()
    );
  });
});
