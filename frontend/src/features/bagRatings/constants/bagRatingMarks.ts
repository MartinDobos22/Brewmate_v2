import type { TileGlyph } from '../../../components/ui';

/**
 * The stars, and the mark of the prompt that asks for them.
 *
 * A star is the one glyph in this app somebody gives rather than is given: the
 * app never scores a coffee, and these are the drinker's own opinion of one.
 */
export const BAG_RATING_MARKS = {
  starGiven: 'star',
  starOpen: 'star-outline',
  prompt: 'star-half-full',
} as const satisfies Record<string, TileGlyph>;

/** Stars offered, left to right. */
export const BAG_RATING_STAR_VALUES = [1, 2, 3, 4, 5] as const;
