/**
 * What somebody said about how strong a cup was.
 *
 * Separate from extraction because they are separate faults with separate
 * fixes: a watery cup wants a tighter ratio, a sour one a finer grind, and a
 * cup can be both. `right` is them saying the strength was fine.
 */
export const CUP_STRENGTHS = {
  weak: 'weak',
  strong: 'strong',
  right: 'right',
} as const;

export type CupStrength = (typeof CUP_STRENGTHS)[keyof typeof CUP_STRENGTHS];

export const CUP_STRENGTH_VALUES = [
  CUP_STRENGTHS.weak,
  CUP_STRENGTHS.strong,
  CUP_STRENGTHS.right,
] as const;
