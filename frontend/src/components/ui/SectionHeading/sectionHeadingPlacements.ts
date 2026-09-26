import type { SpacingToken } from '../../../theme';

/**
 * Where a heading is standing.
 *
 * `screen` is the original: a label over a group of cards, whose top padding
 * is what separates it from the previous group's last card. `card` is the
 * same label inside one, where that padding would be added to the card's own
 * and the heading would float off its content.
 *
 * It exists because a card's gap is sixteen, so a title and the line under it
 * sitting in a card as two loose children read as two unrelated things. They
 * are one child, and this is it.
 */
export type SectionHeadingPlacement = 'screen' | 'card';

export const DEFAULT_SECTION_HEADING_PLACEMENT: SectionHeadingPlacement = 'screen';

export const SECTION_HEADING_TOP_SPACE = {
  screen: 'lg',
  card: 'none',
} as const satisfies Record<SectionHeadingPlacement, SpacingToken>;
