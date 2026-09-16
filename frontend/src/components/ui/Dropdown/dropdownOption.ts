import { normalizeText } from '../../../lib/text';

import type { TileGlyph } from '../Tile';

/** One answer in a dropdown: what it is called, and what it is. */
export interface DropdownOption {
  readonly id: string;
  readonly label: string;
  /** One short line under the label, where the name alone does not say enough. */
  readonly note?: string;
  readonly icon?: TileGlyph;
}

const EMPTY = '';
const NO_MATCHES = 0;
const HAYSTACK_SEPARATOR = ' ';
const WORDS = /\s+/u;

/**
 * Every word of the term has to appear somewhere in the option, in any order.
 *
 * The same rule the grinder catalogue searches by, and for the same reason:
 * "v60 hario" and "hario v60" are the same request, and somebody scanning a
 * list of eighteen brewing methods with one thumb types whichever half of the
 * name they remembered first. Diacritics are stripped on both sides, so
 * "prelievana" finds "Prelievaná".
 */
export const filterDropdownOptions = (
  options: readonly DropdownOption[],
  term: string,
): readonly DropdownOption[] => {
  const words = normalizeText(term.trim())
    .split(WORDS)
    .filter((word: string): boolean => word !== EMPTY);

  if (words.length === NO_MATCHES) {
    return options;
  }

  return options.filter((option: DropdownOption): boolean => {
    const haystack = normalizeText([option.label, option.note ?? EMPTY].join(HAYSTACK_SEPARATOR));

    return words.every((word: string): boolean => haystack.includes(word));
  });
};
