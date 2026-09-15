import { describe, it, expect } from '@jest/globals';
import { Commands } from '../../src/commands/registry';
import { DESTRUCTIVE_COMMANDS } from '../../src/commands/destructive';

describe('destructive commands', () => {
  it('is not empty', () => {
    expect(DESTRUCTIVE_COMMANDS.size).toBeGreaterThan(0);
  });

  it('only references known command ids', () => {
    const known = new Set<string>(Object.values(Commands));
    const unknown = Array.from(DESTRUCTIVE_COMMANDS).filter(command => !known.has(command));
    expect(unknown).toEqual([]);
  });
});
