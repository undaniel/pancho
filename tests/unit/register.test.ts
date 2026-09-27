import { describe, it, expect, beforeEach } from '@jest/globals';
import * as vscode from 'vscode';
import { registerCommand, resetDisabledNotice } from '../../src/utils/register';

interface MockApi {
  __getCommandHandler(id: string): ((...args: unknown[]) => unknown) | undefined;
  __reset(): void;
  __setConfig(key: string, value: unknown): void;
  window: { showWarningMessage: jest.Mock };
}

const mock = vscode as unknown as MockApi;
const context = { subscriptions: { push: (_: unknown) => undefined } } as unknown as vscode.ExtensionContext;

beforeEach(() => {
  mock.__reset();
  mock.__setConfig('enabled', true);
  resetDisabledNotice();
});

describe('registerCommand (enabled master switch)', () => {
  it('runs the handler when Pancho is enabled', async () => {
    let called = false;
    registerCommand(context, 'pancho.test.enabled', () => {
      called = true;
    });
    await mock.__getCommandHandler('pancho.test.enabled')!();
    expect(called).toBe(true);
  });

  it('blocks the handler and warns when Pancho is disabled', async () => {
    mock.__setConfig('enabled', false);
    let called = false;
    registerCommand(context, 'pancho.test.disabled', () => {
      called = true;
    });
    await mock.__getCommandHandler('pancho.test.disabled')!();
    expect(called).toBe(false);
    expect(mock.window.showWarningMessage).toHaveBeenCalledTimes(1);
  });

  it('only warns once per disabled streak', async () => {
    mock.__setConfig('enabled', false);
    registerCommand(context, 'pancho.test.a', () => undefined);
    registerCommand(context, 'pancho.test.b', () => undefined);
    await mock.__getCommandHandler('pancho.test.a')!();
    await mock.__getCommandHandler('pancho.test.b')!();
    expect(mock.window.showWarningMessage).toHaveBeenCalledTimes(1);
  });
});
