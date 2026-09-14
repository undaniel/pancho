import { describe, it, expect } from '@jest/globals';

const { checkL10n } = require('../../scripts/check-l10n');

describe('l10n bundles', () => {
  it('has a bundle entry for every runtime string used in src/', () => {
    const { missing } = checkL10n();
    expect(missing).toEqual([]);
  });
});
