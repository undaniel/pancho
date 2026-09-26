import { describe, it, expect } from '@jest/globals';
import { smartActionsFor } from '../../src/providers/codeActions';
import { Commands } from '../../src/commands/registry';

describe('smartActionsFor', () => {
  it('offers JSON actions for a JSON payload', () => {
    const commands = smartActionsFor('{"a":1}').map(spec => spec.command);
    expect(commands).toContain(Commands.MINIFY_JSON);
    expect(commands).toContain(Commands.PRETTIFY_JSON);
  });

  it('offers JWT decoding for a JWT', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature';
    expect(smartActionsFor(jwt).map(spec => spec.command)).toContain(Commands.DECODE_JWT);
  });

  it('offers CSV actions for delimited text', () => {
    expect(smartActionsFor('a,b\n1,2').map(spec => spec.command)).toContain(Commands.CSV_TO_JSON);
  });

  it('returns nothing for plain text', () => {
    expect(smartActionsFor('just some words')).toEqual([]);
  });
});
