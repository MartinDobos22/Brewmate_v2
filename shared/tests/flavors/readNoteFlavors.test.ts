import { describe, expect, it } from 'vitest';

import { FLAVOR_TAGS, readNoteFlavors } from '../../src/index.js';

describe('reading flavours off a printed label', () => {
  it('reads a Slovak note however it is declined and accented', () => {
    expect(readNoteFlavors(['čokoládový'])).toEqual([FLAVOR_TAGS.chocolate]);
    expect(readNoteFlavors(['Cokolada'])).toEqual([FLAVOR_TAGS.chocolate]);
  });

  it('reads the borrowed English words roasters print', () => {
    expect(readNoteFlavors(['dark chocolate', 'honey'])).toEqual([
      FLAVOR_TAGS.chocolate,
      FLAVOR_TAGS.caramel,
    ]);
  });

  it('names a flavour once however many notes name it', () => {
    expect(readNoteFlavors(['kakao', 'mliečna čokoláda'])).toEqual([FLAVOR_TAGS.chocolate]);
  });

  it('matches the start of a word, not the middle of an unrelated one', () => {
    expect(readNoteFlavors(['aromatický'])).toEqual([]);
  });

  it('concludes nothing from a note it does not know', () => {
    expect(readNoteFlavors(['umami', 'kombucha'])).toEqual([]);
  });
});
