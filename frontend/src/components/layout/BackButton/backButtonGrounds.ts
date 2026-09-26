import type { PillTone, TileGlyph } from '../../ui';

/**
 * What the way back is drawn on.
 *
 * Three grounds, because three exist: the page, the espresso block a screen
 * can be led by, and brew mode's own dark ground. The two dark ones take the
 * quiet espresso pill - the way back is always there and never the thing a
 * screen most wants pressed, so it is never the loud one.
 */
export const BACK_BUTTON_GROUNDS = {
  surface: 'surface',
  espresso: 'espresso',
  brew: 'brew',
} as const;

export type BackButtonGround = (typeof BACK_BUTTON_GROUNDS)[keyof typeof BACK_BUTTON_GROUNDS];

export const BACK_BUTTON_TONES: Record<BackButtonGround, PillTone> = {
  [BACK_BUTTON_GROUNDS.surface]: 'surface',
  [BACK_BUTTON_GROUNDS.espresso]: 'lifted',
  [BACK_BUTTON_GROUNDS.brew]: 'lifted',
};

/** The same chevron the onboarding flow's own way back has always carried. */
export const BACK_BUTTON_GLYPH: TileGlyph = 'chevron-left';
