import { GRIND_DESCRIPTORS, type GrindDescriptor } from './grindDescriptors.js';

export interface GrindWordEntry {
  /** Already accent-free and lower case, the way `normalizeForMatching` leaves text. */
  readonly term: string;
  readonly descriptor: GrindDescriptor;
}

/**
 * How a grind gets described, in the two languages a Brewmate user meets it in.
 *
 * Slovak because that is what the app is written in, English because a recipe
 * pasted out of a video description usually is. Neither list tries to be
 * complete: what it has to cover is the handful of phrases that actually
 * appear in a recipe, and anything it does not recognise falls through to the
 * method's own window rather than to a wrong answer.
 *
 * The order is the mechanism, exactly as in the calibration lexicon: the
 * specific phrasings come first, so "stredne hrube" is matched before the bare
 * "hrube" sitting inside it, and "extra jemne" before "jemne". A list sorted
 * any other way answers "stredne hrubé" with "hrubé" and nobody can see why.
 */
export const GRIND_WORD_LEXICON: readonly GrindWordEntry[] = [
  { term: 'extra jemne', descriptor: GRIND_DESCRIPTORS.extraFine },
  { term: 'velmi jemne', descriptor: GRIND_DESCRIPTORS.extraFine },
  { term: 'extra fine', descriptor: GRIND_DESCRIPTORS.extraFine },
  { term: 'very fine', descriptor: GRIND_DESCRIPTORS.extraFine },
  { term: 'turkish', descriptor: GRIND_DESCRIPTORS.extraFine },
  { term: 'stredne jemne', descriptor: GRIND_DESCRIPTORS.mediumFine },
  { term: 'medium fine', descriptor: GRIND_DESCRIPTORS.mediumFine },
  { term: 'stredne hrube', descriptor: GRIND_DESCRIPTORS.mediumCoarse },
  { term: 'medium coarse', descriptor: GRIND_DESCRIPTORS.mediumCoarse },
  { term: 'velmi hrube', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'very coarse', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'extra coarse', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'hrubsie ako morska sol', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'morska sol', descriptor: GRIND_DESCRIPTORS.mediumCoarse },
  { term: 'sea salt', descriptor: GRIND_DESCRIPTORS.mediumCoarse },
  { term: 'kosher salt', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'kuchynska sol', descriptor: GRIND_DESCRIPTORS.mediumFine },
  { term: 'table salt', descriptor: GRIND_DESCRIPTORS.mediumFine },
  { term: 'praskovy cukor', descriptor: GRIND_DESCRIPTORS.extraFine },
  { term: 'krystalovy cukor', descriptor: GRIND_DESCRIPTORS.medium },
  { term: 'granulated sugar', descriptor: GRIND_DESCRIPTORS.medium },
  { term: 'hrubsi piesok', descriptor: GRIND_DESCRIPTORS.medium },
  { term: 'jemny piesok', descriptor: GRIND_DESCRIPTORS.fine },
  { term: 'piesok', descriptor: GRIND_DESCRIPTORS.mediumFine },
  { term: 'sand', descriptor: GRIND_DESCRIPTORS.mediumFine },
  { term: 'jemne', descriptor: GRIND_DESCRIPTORS.fine },
  { term: 'jemny', descriptor: GRIND_DESCRIPTORS.fine },
  { term: 'fine', descriptor: GRIND_DESCRIPTORS.fine },
  { term: 'stredne', descriptor: GRIND_DESCRIPTORS.medium },
  { term: 'stredny', descriptor: GRIND_DESCRIPTORS.medium },
  { term: 'medium', descriptor: GRIND_DESCRIPTORS.medium },
  { term: 'hrube', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'hruby', descriptor: GRIND_DESCRIPTORS.coarse },
  { term: 'coarse', descriptor: GRIND_DESCRIPTORS.coarse },
];
