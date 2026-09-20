/**
 * Where a ring set is pushed out of the block that clips it.
 *
 * Always out of a corner and always clipped: that is what makes the mark read
 * as depth behind the content rather than as a diagram beside it.
 */
export type RingPlacement = 'topLeft' | 'bottomRight';

export const DEFAULT_RING_PLACEMENT: RingPlacement = 'topLeft';

/**
 * One turn every two and a half minutes.
 *
 * Slow enough to read as depth rather than as animation, which is the whole
 * point: a decoration somebody notices moving is one competing with the thing
 * it sits behind.
 */
export const RINGS_DRIFT_MS = 150000;
