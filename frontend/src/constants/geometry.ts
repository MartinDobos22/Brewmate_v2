/**
 * The arithmetic every ring in this app is laid out with.
 *
 * Here rather than written into a component for the reason the radar's own
 * geometry is: a number inside a function is a number nobody can find. Half a
 * box is where its centre is, a diameter is two radii, and a full turn is what
 * a circumference is measured in.
 */
export const CIRCLE = {
  half: 2,
  fullTurn: Math.PI * 2,
  /**
   * Where a ring starts. Twelve o'clock rather than three, because a ring is
   * read the way a clock is and nothing anybody measures begins at the right.
   */
  startAngle: -90,
} as const;

/**
 * The app's own mark, as shares of the square it is drawn in.
 *
 * Three concentric circles, and how far the set is pushed out of the corner
 * that clips it. Shares rather than points, so the same mark at 250 and at 300
 * is clipped by the same amount of itself rather than by a fixed number of
 * points that would swallow the small one.
 */
export const RINGS = {
  radii: [0.487, 0.367, 0.247],
  bleed: 0.43,
  /**
   * How far the centred set hangs off the top edge.
   *
   * Much less than a corner's bleed, because only one edge clips it: pushed
   * out by the same share it would be in a corner, a centred set would be
   * three arcs across the top rather than a mark the screen is built around.
   */
  topBleed: 0.16,
} as const;
