/**
 * Depth.
 *
 * The app used to tell surfaces apart by colour and a hairline outline, and a
 * shadow was reserved for the three things that genuinely float. The A2
 * redesign inverts that: there are no borders on cards at all, and depth is
 * what separates one surface from the next - so the steps below are
 * load-bearing rather than decorative, and each names the kind of element it
 * belongs under.
 *
 * A step carries geometry only. The tint is chosen at the call site, because
 * the same lift is cast in three different colours depending on what it falls
 * on: warm brown on a light ground, black under a cream pill on espresso
 * (where a brown shadow is invisible), and the pour arc's own accent under
 * brew mode's pause button.
 *
 * `elevation` is Android's single-number approximation of the other three,
 * and it is the only one of the four that platform reads - which is also why
 * an upward shadow (`footBar`, `overlay`) still carries a positive one there.
 */
export interface ElevationStyle {
  readonly shadowOffset: { readonly width: number; readonly height: number };
  readonly shadowOpacity: number;
  readonly shadowRadius: number;
  readonly elevation: number;
}

export const ELEVATION = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  raised: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  overlay: {
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  /** Every soft card. The step that replaced the hairline. */
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  /**
   * The one card on a screen that matters more than the ones around it - the
   * ready bag above the ageing one, the latest recipe version above the first.
   */
  cardEmphasis: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  /** A dark button on a light ground. */
  buttonDark: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  /** A card that has been chosen: an answered question, a picked brewer. */
  cardSelected: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 6,
  },
  /** A cream pill on an espresso ground. Tinted black, not brown. */
  pillOnEspresso: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 24,
    elevation: 8,
  },
  /** The verdict, and anything else that is the whole answer to a screen. */
  cardHero: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 9,
  },
  /**
   * Brew mode's pause button, tinted with the pour arc's own accent - the one
   * lift in the app drawn in a colour rather than in a shade, because it falls
   * on a ground too dark for a shadow to register at all.
   */
  brewControl: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 10,
  },
  /** A bar pinned to the bottom of a screen, casting upwards onto the content. */
  footBar: {
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
} as const satisfies Record<string, ElevationStyle>;

export type ElevationToken = keyof typeof ELEVATION;

/** Hairline outlines and the one-pixel-ish borders used across the app. */
export const BORDER_WIDTH = {
  none: 0,
  thin: 1,
  thick: 2,
} as const;

export type BorderWidthToken = keyof typeof BORDER_WIDTH;

/** Opacity applied to a pressed or disabled surface. */
export const OPACITY = {
  full: 1,
  pressed: 0.72,
  disabled: 0.38,
  scrim: 0.45,
  /**
   * A decoration behind content has to survive both schemes without ever
   * competing with the text on top of it. Low enough that a dark tile does not
   * turn into a diagram, high enough that a light one is not blank.
   */
  watermark: 0.16,
} as const;

export type OpacityToken = keyof typeof OPACITY;
