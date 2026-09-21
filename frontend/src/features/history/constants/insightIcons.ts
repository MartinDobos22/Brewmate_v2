import type { TileGlyph } from '../../../components/ui';

/** The mark beside the sentence that says these are counts and not ratings. */
export const INSIGHTS_NOTE_ICON: TileGlyph = 'information-outline';

/** How many cups the report was drawn from, beside the denominator. */
export const INSIGHTS_COUNT_ICON: TileGlyph = 'counter';

/**
 * What the proposal is, and what it would change.
 *
 * A roast level and a set of tasting notes are the only two things the
 * history ever proposes, so the two glyphs are named rather than looked up:
 * a third would be a change to what the suggestion can contain, which is a
 * decision in the contract rather than an icon here.
 */
export const SUGGESTION_ICONS = {
  heading: 'account-edit-outline',
  roast: 'fire',
  notes: 'fruit-citrus',
  accept: 'check',
  dismiss: 'close',
} as const satisfies Record<string, TileGlyph>;
