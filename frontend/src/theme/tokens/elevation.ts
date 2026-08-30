/**
 * Surfaces are told apart by colour (`surfaceContainer`), not by shadow.
 * A shadow is only for something that genuinely floats above the content:
 * a bottom sheet, a FAB, a dialog. Cards in a list have no shadow - they have
 * their own surface and a quiet outline.
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
