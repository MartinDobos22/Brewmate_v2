import { RADAR_GEOMETRY } from '../constants/radarChart';

export interface RadarPoint {
  readonly x: number;
  readonly y: number;
}

export interface RadarFrame {
  /** Half the drawn square, which is where the web is centred. */
  readonly center: number;
  /** The distance from the centre to a value at the top of the scale. */
  readonly radius: number;
  readonly axisCount: number;
}

/**
 * Where one axis points.
 *
 * The first axis is straight up and the rest run clockwise, which is what
 * makes the shape recognisable rather than merely correct: a web whose first
 * vertex sat at three o'clock would be read differently by everybody who
 * looked at it, and the same profile has to look like the same profile every
 * time it is opened.
 */
const axisAngle = (index: number, axisCount: number): number =>
  index * (RADAR_GEOMETRY.fullTurn / axisCount) - RADAR_GEOMETRY.quarterTurn;

/** A point at a given distance along a given axis. */
export const radarPoint = (frame: RadarFrame, index: number, distance: number): RadarPoint => {
  const angle = axisAngle(index, frame.axisCount);

  return {
    x: frame.center + Math.cos(angle) * distance,
    y: frame.center + Math.sin(angle) * distance,
  };
};

/**
 * The shape a set of values makes.
 *
 * Values are taken as a share of the scale rather than as a number, so the
 * chart never has to know what the scale is - it draws whatever it is handed
 * against the full radius, which is what keeps a profile that has barely moved
 * off the middle looking like one.
 */
export const radarShape = (frame: RadarFrame, shares: readonly number[]): readonly RadarPoint[] =>
  shares.map((share: number, index: number): RadarPoint =>
    radarPoint(frame, index, frame.radius * share),
  );

/** One of the concentric rings the web is built from. */
export const radarRing = (
  frame: RadarFrame,
  ring: number,
  ringCount: number,
): readonly RadarPoint[] =>
  Array.from({ length: frame.axisCount }, (_: unknown, index: number): RadarPoint =>
    radarPoint(frame, index, (frame.radius * ring) / ringCount),
  );

/** The rings, outermost last, so the outer edge is drawn over the inner ones. */
export const radarRings = (
  frame: RadarFrame,
  ringCount: number,
): readonly (readonly RadarPoint[])[] =>
  Array.from({ length: ringCount }, (_: unknown, ring: number): readonly RadarPoint[] =>
    radarRing(frame, ring + RADAR_GEOMETRY.firstRing, ringCount),
  );

/** Points in the form an SVG polygon wants them. */
export const toPolygonPoints = (points: readonly RadarPoint[]): string =>
  points.map(({ x, y }: RadarPoint): string => `${String(x)},${String(y)}`).join(' ');

/**
 * The frame a square of a given size and label inset provides.
 *
 * The inset is what the labels sit in. Reserving it here rather than padding
 * the container means the drawn square and the touchable square are the same
 * square, so nothing shifts when the labels are turned off for the home tile.
 */
export const radarFrame = (size: number, labelInset: number, axisCount: number): RadarFrame => ({
  center: size / RADAR_GEOMETRY.half,
  radius: size / RADAR_GEOMETRY.half - labelInset,
  axisCount,
});
