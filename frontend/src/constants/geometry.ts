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
