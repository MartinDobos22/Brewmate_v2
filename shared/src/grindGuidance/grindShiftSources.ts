/**
 * What moved a grind away from the middle of its method's window.
 *
 * A closed set rather than free text, because these travel: the prompt names
 * them so a rationale can say which fact decided the number, and the app
 * prints them so somebody can disagree with the reasoning rather than only
 * with the result. A starting point that cannot say why it is where it is is
 * indistinguishable from a guess.
 */
export const GRIND_SHIFT_SOURCES = {
  roastLevel: 'roastLevel',
  process: 'process',
  restDays: 'restDays',
} as const;

export type GrindShiftSource = (typeof GRIND_SHIFT_SOURCES)[keyof typeof GRIND_SHIFT_SOURCES];

/** One reason the grind is not in the middle of the window, and how far it moved it. */
export interface GrindShift {
  readonly source: GrindShiftSource;
  /** A fraction of the window's half-width. Positive is coarser. */
  readonly amount: number;
}
