import type { ElevationToken } from '../../../theme';

/**
 * How far a card stands off what it sits on.
 *
 * This replaced a list of six variants that were really two questions asked
 * at once - which surface, and whether there was a hairline round it. The A2
 * redesign answers the first once and for all (there is one card colour) and
 * removes the second outright: there are no borders on cards, and depth is
 * what separates one surface from the next. What is left is the only thing a
 * caller still has to decide.
 */
export type CardDepth = 'rest' | 'emphasis';

export const DEFAULT_CARD_DEPTH: CardDepth = 'rest';

/**
 * `emphasis` is for the one card on a screen that matters more than the ones
 * around it - the ready bag above the ageing one, the latest version of a
 * recipe above the first, the pinned recipe among the saved ones. It is a
 * comparison rather than a level, so a screen with one card never uses it.
 */
export const CARD_ELEVATIONS = {
  rest: 'card',
  emphasis: 'cardEmphasis',
} as const satisfies Record<CardDepth, ElevationToken>;
