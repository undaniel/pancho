import { describe, it, expect } from '@jest/globals';
import { ClipboardHistory } from '../../src/utils/clipboardHistory';

describe('ClipboardHistory', () => {
  it('keeps the newest entry first', () => {
    const history = new ClipboardHistory(10);
    history.push('one', 1);
    history.push('two', 2);
    expect(history.list().map(entry => entry.text)).toEqual(['two', 'one']);
  });

  it('ignores consecutive duplicates', () => {
    const history = new ClipboardHistory(10);
    history.push('one', 1);
    expect(history.push('one', 2)).toBe(false);
    expect(history.size).toBe(1);
  });

  it('moves an existing entry to the top instead of duplicating it', () => {
    const history = new ClipboardHistory(10);
    history.push('one', 1);
    history.push('two', 2);
    history.push('one', 3);
    expect(history.list().map(entry => entry.text)).toEqual(['one', 'two']);
  });

  it('respects the maximum size', () => {
    const history = new ClipboardHistory(2);
    history.push('one', 1);
    history.push('two', 2);
    history.push('three', 3);
    expect(history.list().map(entry => entry.text)).toEqual(['three', 'two']);
  });

  it('restores serialized order', () => {
    const history = new ClipboardHistory(10);
    history.push('one', 1);
    history.push('two', 2);
    const restored = new ClipboardHistory(10);
    restored.load(history.list());
    expect(restored.list().map(entry => entry.text)).toEqual(['two', 'one']);
  });
});
