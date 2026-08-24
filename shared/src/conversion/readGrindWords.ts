import { GRIND_WORD_LEXICON, type GrindWordEntry } from './grindWordLexicon.js';
import type { GrindDescriptor } from './grindDescriptors.js';
import { normalizeForMatching } from './normalizeForMatching.js';

/**
 * The grind a recipe described in words, where it described one.
 *
 * Deterministic and offline, like the calibration lexicon it is modelled on -
 * and for the same reason. What a conversion understood has to be showable
 * back to the person who pasted the recipe in, word for word, and a model
 * asked to characterise a grind can only be taken on trust.
 *
 * @returns the descriptor, or null when nothing in the text was recognised -
 * which is a normal outcome and falls through to the method's own window.
 */
export const readGrindWords = (text: string | null): GrindDescriptor | null => {
  if (text === null) {
    return null;
  }

  const normalized = normalizeForMatching(text);

  return (
    GRIND_WORD_LEXICON.find((entry: GrindWordEntry): boolean => normalized.includes(entry.term))
      ?.descriptor ?? null
  );
};
