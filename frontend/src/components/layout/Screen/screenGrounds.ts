/**
 * What a screen is painted on.
 *
 * `surface` is the ordinary case and follows the colour scheme. `brew` does
 * not: brew mode is dark in both schemes, because it is read at arm's length
 * over a running timer in a kitchen, and a white screen held over a kettle by
 * somebody whose phone happens to be set to light is the case it is drawn
 * against.
 *
 * A closed set rather than a colour, so a screen names the ground it belongs
 * on and never picks one - and so the safe area above the notch is painted the
 * same as the content under it, which is the part a screen that painted its
 * own root would get wrong.
 */
export const SCREEN_GROUNDS = {
  surface: 'surface',
  brew: 'brew',
} as const;

export type ScreenGround = (typeof SCREEN_GROUNDS)[keyof typeof SCREEN_GROUNDS];

export const DEFAULT_SCREEN_GROUND: ScreenGround = SCREEN_GROUNDS.surface;
