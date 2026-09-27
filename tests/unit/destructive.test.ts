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

  it('excludes plain conversions and reformatting', () => {
    const conversions = [
      Commands.LINE_ENDINGS_TO_SPACES,
      Commands.CLEAN_WHITESPACE,
      Commands.CLEAN_LINE_ENDINGS,
      Commands.TRIM_LINES,
      Commands.TO_WINDOWS_EOL,
      Commands.TO_UNIX_EOL,
      Commands.TO_MAC_EOL,
      Commands.NUMBER_LINES,
      Commands.WRAP_TEXT,
      Commands.UNWRAP_TEXT,
      Commands.ALIGN_EQUALS,
    ];
    expect(conversions.filter(command => DESTRUCTIVE_COMMANDS.has(command))).toEqual([]);
  });
});
