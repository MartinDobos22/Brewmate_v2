/**
 * Moves a stored value part of the way towards an observation.
 *
 * A weight of 1 replaces it outright, a weight of 0 leaves it alone. This is
 * the whole of the learning rule: no model, no hidden state, just a step whose
 * size is the trust placed in the evidence.
 */
export const blendValue = (current: number, observed: number, weight: number): number =>
  current + (observed - current) * weight;

/** Keeps a weight inside the range the contract promises. */
export const clampWeight = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
