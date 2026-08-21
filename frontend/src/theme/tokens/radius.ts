/**
 * Corner radius scale.
 *
 * A deliberate deviation from Material Design 3: MD3 gives buttons and chips a
 * pill shape (radius 20+). Brewmate does not. Buttons are rectangles with a
 * radius of 12, so the app reads as squarer and calmer - but no corner is ever
 * sharp. `full` is reserved for the avatar and the circular progress ring.
 */
export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export type RadiusToken = keyof typeof RADIUS;
