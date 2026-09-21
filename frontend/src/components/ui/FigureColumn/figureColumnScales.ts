import type { TextTone } from '../Text';
import type { TypographyToken } from '../../../theme';

/**
 * How big the three figures a recipe is made of are drawn.
 *
 * Three sizes, named after the block they belong to rather than after a rung
 * on a ladder: the home screen leads with them and they are the largest thing
 * on it, the conversation's header sums them up over a thread, and a version
 * on the timeline prints them inside a card.
 *
 * Each is a pair, because the ratio is always smaller than the two weights.
 * Grams are the physical fact somebody weighs out and the ratio is what
 * divides them - printing all three at one size would invite the reader to
 * treat the arithmetic as a third thing to get right.
 */
export type FigureScale = 'hero' | 'header' | 'inline';

export const DEFAULT_FIGURE_SCALE: FigureScale = 'inline';

export const FIGURE_VALUE_VARIANTS = {
  hero: 'numericLead',
  header: 'numericHeader',
  inline: 'numericLeadMinor',
} as const satisfies Record<FigureScale, TypographyToken>;

export const FIGURE_DERIVED_VARIANTS = {
  hero: 'numericLeadMinor',
  header: 'numericValue',
  inline: 'numericInline',
} as const satisfies Record<FigureScale, TypographyToken>;

/**
 * What the pair is painted on, which decides the palette and nothing else.
 *
 * The same three numbers appear on an espresso block and inside a white card,
 * and neither scheme's own roles read on the other.
 */
export type FigureGround = 'surface' | 'espresso';

export const DEFAULT_FIGURE_GROUND: FigureGround = 'surface';

export const FIGURE_VALUE_TONES = {
  surface: 'default',
  espresso: 'onEspresso',
} as const satisfies Record<FigureGround, TextTone>;

export const FIGURE_LABEL_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<FigureGround, TextTone>;
