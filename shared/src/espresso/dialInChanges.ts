/**
 * The one thing a dial-in answer is allowed to move.
 *
 * Grind or dose, never both, and this list is what makes that enforceable
 * rather than requested. Two variables moved at once produce a shot that
 * cannot be read: it came out differently, and nobody can say which change did
 * it. The whole mode exists to reach a good shot in as few attempts as
 * possible, and the fastest way to waste four of them is to change two things
 * each time.
 *
 * `none` is a real answer, and an important one: the shot was good, or the
 * last change has not been given a fair try yet, and asking somebody to grind
 * again would be movement for its own sake.
 */
export const DIAL_IN_CHANGES = {
  grind: 'grind',
  dose: 'dose',
  none: 'none',
} as const;

export type DialInChange = (typeof DIAL_IN_CHANGES)[keyof typeof DIAL_IN_CHANGES];

/** Which way a change went, for the timeline to draw. */
export const DIAL_IN_DIRECTIONS = {
  finer: 'finer',
  coarser: 'coarser',
  more: 'more',
  less: 'less',
} as const;

export type DialInDirection = (typeof DIAL_IN_DIRECTIONS)[keyof typeof DIAL_IN_DIRECTIONS];
