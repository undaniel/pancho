import { describe, it, expect } from '@jest/globals';
import { formatShortDateTime, formatLongDateTime, formatCustomDateTime } from '../../src/transforms/dateTime';

describe('dateTime', () => {
  it('formats a custom date/time', () => {
    expect(formatCustomDateTime()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('formats short and long date/time using the given locale', () => {
    expect(formatShortDateTime('en-US').length).toBeGreaterThan(0);
    expect(formatLongDateTime('en-US').length).toBeGreaterThan(0);
  });
});
