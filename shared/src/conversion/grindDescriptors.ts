/**
 * A grind, in the words anybody can act on.
 *
 * Every conversion produces one of these, whether or not it also produces a
 * number. A collar setting is only an instruction to somebody whose grinder is
 * in the catalogue with a curve behind it, which is a minority of grinders and
 * a minority of people; "stredne hrubé" is something the other majority can
 * do something with.
 *
 * Machine names, translated by whoever prints them. The conversion module
 * writes no Slovak: a deterministic calculation that also produces prose is
 * one nobody can swap out.
 */
export const GRIND_DESCRIPTORS = {
  extraFine: 'extraFine',
  fine: 'fine',
  mediumFine: 'mediumFine',
  medium: 'medium',
  mediumCoarse: 'mediumCoarse',
  coarse: 'coarse',
} as const;

export type GrindDescriptor = (typeof GRIND_DESCRIPTORS)[keyof typeof GRIND_DESCRIPTORS];
