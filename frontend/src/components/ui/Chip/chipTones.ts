import type { ColorPalette, ElevationToken, SizeToken } from '../../../theme';
import type { TextTone, TextVariant } from '../Text';

/**
 * What a chip that states something is painted in.
 *
 * Only the pill kind takes one. A chip that can be selected is a control and
 * carries the selection's own two fills, because "chosen" and "not chosen"
 * are the only two things it has to say.
 */
export type ChipTone = 'neutral' | 'fresh' | 'lifted';

export const DEFAULT_CHIP_TONE: ChipTone = 'neutral';

export const CHIP_FILLS = {
  /** A control fill, for the reason `PILL_BACKGROUNDS` gives at length. */
  neutral: 'surfaceContainerHigh',
  fresh: 'freshContainer',
  /**
   * The card surface, which is the same colour as most of what a chip sits
   * on - so this is the one tone that needs a shadow to exist at all. It is
   * for a fact that has to read as present rather than quiet, beside one that
   * is painted.
   */
  lifted: 'surface',
} as const satisfies Record<ChipTone, keyof ColorPalette>;

export const CHIP_ELEVATIONS = {
  neutral: null,
  fresh: null,
  lifted: 'card',
} as const satisfies Record<ChipTone, ElevationToken | null>;

export const CHIP_LABEL_TONES = {
  neutral: 'default',
  fresh: 'default',
  lifted: 'muted',
} as const satisfies Record<ChipTone, TextTone>;

export const CHIP_ICON_COLORS = {
  neutral: 'onSurfaceVariant',
  fresh: 'onFreshContainer',
  lifted: 'onSurfaceVariant',
} as const satisfies Record<ChipTone, keyof ColorPalette>;

/**
 * Two heights, where there were three.
 *
 * `small` is a fact printed on a card - an attribute of the thing it sits on,
 * and nothing anybody is going to touch. `medium` is a chip in a row of its
 * own. The third was 34, two points off `medium`, which is a difference no
 * reader can see and one every new chip had to guess at.
 */
export type ChipSize = 'small' | 'medium';

export const DEFAULT_CHIP_SIZE: ChipSize = 'medium';

export const CHIP_HEIGHTS = {
  small: 'attributeChipHeight',
  medium: 'chipHeight',
} as const satisfies Record<ChipSize, SizeToken>;

export const CHIP_LABEL_VARIANTS = {
  small: 'chipLabel',
  medium: 'statusLabel',
} as const satisfies Record<ChipSize, TextVariant>;
