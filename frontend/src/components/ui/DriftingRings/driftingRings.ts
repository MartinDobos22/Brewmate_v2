/**
 * Where a ring set is pushed out of the block that clips it.
 *
 * Usually out of a corner and clipped by two edges, which is what makes the
 * mark read as depth behind the content rather than as a diagram beside it.
 *
 * `topCentre` is the exception, and it is the signed-out screens: there the
 * brown is the whole screen rather than a block on one, so there is no corner
 * for a mark to be pushed out of. It hangs off the top edge instead, centred
 * on the brand mark under it, and is clipped by that one edge.
 */
export type RingPlacement = 'topLeft' | 'bottomRight' | 'topCentre';

export const DEFAULT_RING_PLACEMENT: RingPlacement = 'topLeft';

/**
 * One turn every two and a half minutes.
 *
 * Slow enough to read as depth rather than as animation, which is the whole
 * point: a decoration somebody notices moving is one competing with the thing
 * it sits behind.
 */
export const RINGS_DRIFT_MS = 150000;
