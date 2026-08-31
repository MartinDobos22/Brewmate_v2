/**
 * The geometry and weight of the taste web.
 *
 * Everything here is in the chart's own coordinate space rather than in the
 * app's spacing scale, which is why it lives beside the chart instead of in
 * the theme: a stroke two units wide is two units of a square whose size is a
 * design token, and expressing it in the same scale as a card's padding would
 * only make both harder to change.
 */
export const RADAR_CHART = {
  /**
   * Three rings, not five. The web is a frame of reference, not a scale to be
   * read off - anybody counting rings to recover a number has been failed by
   * the chart, and five faint rings behind a five-sided shape is a moiré.
   */
  ringCount: 3,
  ringStrokeWidth: 1,
  /** The spokes are fainter than the rings: they locate the axes, nothing more. */
  spokeStrokeWidth: 1,
  shapeStrokeWidth: 2,
  /**
   * The fill is deliberately weak. It is what makes the shape read as one
   * object rather than as five points joined by lines, but a solid colour
   * inside it would bury the rings and turn a chart into a badge.
   */
  shapeFillOpacity: 0.16,
  spokeOpacity: 0.6,
  /** A vertex the profile has earned, and one it is only guessing at. */
  vertexRadius: 4,
  unknownVertexRadius: 3.5,
  unknownVertexStrokeWidth: 1.5,
  /** How far outside the web an axis label sits. */
  labelGap: 15,
} as const;

/**
 * What an axis nobody has said anything about is drawn at.
 *
 * The middle, because that is where the profile stores it - and the whole
 * reason the vertex is drawn hollow and the label muted is that the middle
 * here means silence rather than a preference for the middle. A chart cannot
 * leave a hole in a polygon, so it says so at the vertex instead.
 */
export const UNKNOWN_AXIS_MARKER_OPACITY = 0.45;

/**
 * The arithmetic the web is laid out with.
 *
 * Here rather than beside the geometry because a number written into a
 * function is a number nobody can find: half a square is where its centre is,
 * a full turn is what five axes divide, and a quarter turn is what puts the
 * first of them straight up instead of at three o'clock.
 */
export const RADAR_GEOMETRY = {
  half: 2,
  fullTurn: Math.PI * 2,
  quarterTurn: Math.PI / 2,
  firstRing: 1,
} as const;
