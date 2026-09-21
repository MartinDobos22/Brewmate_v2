import type { ColorPalette } from '../../../theme';
import type { TextTone } from '../Text';

/**
 * What a placeholder state is drawn on.
 *
 * `surface` is every ordinary screen. `espresso` is brew mode and the
 * signed-out screens - dark in both colour schemes, so a state drawn in the
 * light scheme's greys is invisible there. Before this, a brew whose recipe
 * was still loading showed light-grey text on a near-black ground, which is
 * the one screen in the app read at arm's length.
 */
export type StateGround = 'surface' | 'espresso';

export const DEFAULT_STATE_GROUND: StateGround = 'surface';

/** The two dashed rings, outer then inner. */
export const STATE_MARK_RINGS = {
  surface: ['outlineDashed', 'outlineFaint'],
  espresso: ['espressoLine', 'espressoLift'],
} as const satisfies Record<StateGround, readonly [keyof ColorPalette, keyof ColorPalette]>;

export const STATE_MARK_GLYPH_COLORS = {
  surface: 'onSurfaceEmptyStrong',
  espresso: 'onEspressoVariant',
} as const satisfies Record<StateGround, keyof ColorPalette>;

export const STATE_TITLE_TONES = {
  surface: 'default',
  espresso: 'onEspresso',
} as const satisfies Record<StateGround, TextTone>;

export const STATE_BODY_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<StateGround, TextTone>;

/** What a spinner is painted in, and what a failure's heading reads as. */
export const STATE_SPINNER_COLORS = {
  surface: 'primary',
  espresso: 'accentOnEspresso',
} as const satisfies Record<StateGround, keyof ColorPalette>;

export const STATE_ERROR_TONES = {
  surface: 'error',
  espresso: 'accent',
} as const satisfies Record<StateGround, TextTone>;
