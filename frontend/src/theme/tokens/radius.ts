/**
 * Corner radius scale.
 *
 * A deliberate deviation from Material Design 3: MD3 gives buttons and chips a
 * pill shape (radius 20+). Brewmate does not. Buttons are rectangles with a
 * radius of 12, so the app reads as squarer and calmer - but no corner is ever
 * sharp. `full` is reserved for circles and for the elements the A2 redesign
 * draws as pills, where the radius is half the height whatever the height is.
 *
 * The steps above `lg` were added for that redesign and nothing below them
 * moved: a card that has always been 16 is still 16, and a screen opts into
 * the softer geometry by naming it in `SHAPE`.
 */
export const RADIUS = {
  none: 0,
  /** The roast spine, and the thinnest bar this app draws. */
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  /**
   * Soft cards and the blocks inset within an espresso header. Sits between
   * `lg` and `xl` because the redesign's own range for both is 18-20 and one
   * step is easier to keep consistent than two that differ by two points.
   */
  lgPlus: 20,
  xl: 24,
  /** Hero cards - the one card on a screen that carries the whole answer. */
  xxl: 28,
  /** The espresso header's bottom corners, and nothing else. */
  xxxl: 32,
  full: 999,
} as const;

export type RadiusToken = keyof typeof RADIUS;
