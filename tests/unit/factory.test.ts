import { describe, it, expect, beforeEach } from '@jest/globals';
import * as vscode from 'vscode';
import { registerTextCommand, registerInsertCommand, registerDocumentCommand } from '../../src/commands/factory';

interface MockApi {
  __getCommandHandler(id: string): ((...args: unknown[]) => unknown) | undefined;
  __reset(): void;
  window: {
    activeTextEditor: unknown;
    showWarningMessage: jest.Mock;
    showErrorMessage: jest.Mock;
  };
}

const mock = vscode as unknown as MockApi;

const context = { subscriptions: { push: () => {} } } as unknown as vscode.ExtensionContext;

interface Pos {
  line: number;
  character: number;
}

function offsetAt(text: string, pos: Pos): number {
  const lines = text.split('\n');
  let offset = 0;
  for (let i = 0; i < pos.line; i++) offset += lines[i].length + 1;
  return offset + pos.character;
}

function positionAt(text: string, offset: number): Pos {
  const lines = text.split('\n');
  let consumed = 0;
  for (let line = 0; line < lines.length; line++) {
    if (offset <= consumed + lines[line].length) {
      return { line, character: offset - consumed };
    }
    consumed += lines[line].length + 1;
  }
  const last = lines.length - 1;
  return { line: last, character: lines[last].length };
}

function makeDocument(text: string) {
  return {
    getText(range?: { start: Pos; end: Pos }) {
      if (!range) return text;
      return text.slice(offsetAt(text, range.start), offsetAt(text, range.end));
    },
    lineAt(line: number) {
      const value = text.split('\n')[line] ?? '';
      return { range: { start: { line, character: 0 }, end: { line, character: value.length } }, text: value };
    },
    offsetAt: (pos: Pos) => offsetAt(text, pos),
    positionAt: (offset: number) => positionAt(text, offset),
    get lineCount() {
      return text.split('\n').length;
    },
  };
}

function makeSelection(startLine = 0, startChar = 0, endLine = startLine, endChar = startChar) {
  return {
    start: { line: startLine, character: startChar },
    end: { line: endLine, character: endChar },
    anchor: { line: startLine, character: startChar },
    active: { line: endLine, character: endChar },
    isEmpty: startLine === endLine && startChar === endChar,
  };
}

function makeEditor(text: string, selections = [makeSelection()]) {
  const operations: { type: string; text: string }[] = [];
  return {
    document: makeDocument(text),
    selection: selections[0],
    selections,
    options: { tabSize: 4 },
    operations,
    edit(callback: (builder: { replace: (r: unknown, v: string) => void; insert: (p: unknown, v: string) => void }) => void) {
      callback({
        replace: (_range, value) => operations.push({ type: 'replace', text: value }),
        insert: (_position, value) => operations.push({ type: 'insert', text: value }),
      });
      return Promise.resolve(true);
    },
  };
}

describe('command factory contracts', () => {
  beforeEach(() => {
    mock.__reset();
  });

  it('does not insert text when the insert transform errors', async () => {
    const editor = makeEditor('hello', [makeSelection(0, 5)]);
    mock.window.activeTextEditor = editor;
    registerInsertCommand(context, {
      command: 'pancho.test.insert' as never,
      insert: () => ({ result: 'x', error: 'boom' }),
    });

    await mock.__getCommandHandler('pancho.test.insert')!();

    expect(editor.operations).toHaveLength(0);
    expect(mock.window.showWarningMessage).toHaveBeenCalledWith(expect.stringContaining('boom'));
  });

  it('shows the error (not the warning) when both are present and does not edit', async () => {
    const editor = makeEditor('abc');
    mock.window.activeTextEditor = editor;
    registerTextCommand(context, {
      command: 'pancho.test.text' as never,
      transform: () => ({ result: '', error: 'ERR', warning: 'WARN' }),
    });

    await mock.__getCommandHandler('pancho.test.text')!();

    expect(mock.window.showWarningMessage).toHaveBeenCalledWith(expect.stringContaining('ERR'));
    expect(mock.window.showWarningMessage).not.toHaveBeenCalledWith(expect.stringContaining('WARN'));
    expect(editor.operations).toHaveLength(0);
  });

  it('applies the document transform on success', async () => {
    const editor = makeEditor('abc');
    mock.window.activeTextEditor = editor;
    registerTextCommand(context, {
      command: 'pancho.test.upper' as never,
      transform: text => text.toUpperCase(),
    });

    await mock.__getCommandHandler('pancho.test.upper')!();

    expect(editor.operations).toEqual([{ type: 'replace', text: 'ABC' }]);
  });

  it('transforms only the selection when there is one', async () => {
    const editor = makeEditor('hello world', [makeSelection(0, 6, 0, 11)]);
    mock.window.activeTextEditor = editor;
    registerTextCommand(context, {
      command: 'pancho.test.sel' as never,
      transform: text => text.toUpperCase(),
    });

    await mock.__getCommandHandler('pancho.test.sel')!();

    expect(editor.operations).toEqual([{ type: 'replace', text: 'WORLD' }]);
  });

  it('applies the transform per cursor with multiple cursors', async () => {
    const editor = makeEditor('foo\nbar\nbaz', [makeSelection(0, 0), makeSelection(2, 0)]);
    mock.window.activeTextEditor = editor;
    registerTextCommand(context, {
      command: 'pancho.test.multi' as never,
      transform: text => text.toUpperCase(),
    });

    await mock.__getCommandHandler('pancho.test.multi')!();

    expect(editor.operations).toHaveLength(2);
    expect(editor.operations.map(o => o.text).sort()).toEqual(['BAZ', 'FOO']);
  });

  it('inserts at every cursor', async () => {
    const editor = makeEditor('foo\nbar\nbaz', [makeSelection(0, 0), makeSelection(2, 0)]);
    mock.window.activeTextEditor = editor;
    registerInsertCommand(context, {
      command: 'pancho.test.insmulti' as never,
      insert: () => 'X',
    });

    await mock.__getCommandHandler('pancho.test.insmulti')!();

    expect(editor.operations).toEqual([
      { type: 'insert', text: 'X' },
      { type: 'insert', text: 'X' },
    ]);
  });

  it('document command applies the selection as a pattern over the whole document', async () => {
    const editor = makeEditor('foo\nbar\nbaz', [makeSelection(1, 0, 1, 3)]);
    mock.window.activeTextEditor = editor;
    registerDocumentCommand(context, {
      command: 'pancho.test.doc' as never,
      transform: (text, pattern) => text.split('\n').filter(l => l.includes(pattern)).join('\n'),
    });

    await mock.__getCommandHandler('pancho.test.doc')!();

    expect(editor.operations).toEqual([{ type: 'replace', text: 'bar' }]);
  });

  it('document command warns when no pattern is selected', async () => {
    const editor = makeEditor('foo\nbar', [makeSelection(0, 0)]);
    mock.window.activeTextEditor = editor;
    registerDocumentCommand(context, {
      command: 'pancho.test.doc2' as never,
      transform: text => text,
    });

    await mock.__getCommandHandler('pancho.test.doc2')!();

    expect(editor.operations).toHaveLength(0);
    expect(mock.window.showWarningMessage).toHaveBeenCalledWith(expect.stringContaining('pattern'));
  });

  it('warns when there is no active editor', async () => {
    registerTextCommand(context, {
      command: 'pancho.test.noeditor' as never,
      transform: text => text,
    });

    await mock.__getCommandHandler('pancho.test.noeditor')!();

    expect(mock.window.showWarningMessage).toHaveBeenCalled();
  });
});
