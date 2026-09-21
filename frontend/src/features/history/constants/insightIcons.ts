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

/**
 * The badge that says something was missing, and the fallback for a
 * constraint somebody typed in themselves.
 *
 * The lead badge states the fact and the ones after it name what: only the
 * first carries the caution tone, because a row of ochre pills would read as
 * a list of mistakes rather than as a fact about one morning.
 */
export const CONSTRAINT_LEAD_ICON: TileGlyph = 'alert-outline';
export const OTHER_CONSTRAINT_ICON: TileGlyph = 'help-circle-outline';

/**
 * One version of a recipe, on the rail: what it is, what was said about it,
 * what came of it, and the way into the conversation.
 */
export const TIMELINE_ICONS = {
  quote: 'format-quote-open',
  brews: 'coffee-outline',
  notes: 'message-text-outline',
  chat: 'message-outline',
  latest: 'check',
} as const satisfies Record<string, TileGlyph>;
