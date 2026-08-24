const UNICODE_DECOMPOSED = 'NFD';
const COMBINING_MARKS = /\p{Diacritic}/gu;
const NOTHING = '';
const NON_LETTERS = /[^\p{Letter}\p{Number}]+/gu;
const SINGLE_SPACE = ' ';

/**
 * Text reduced to something two spellings of the same word both hit.
 *
 * Accents come off, case goes, and everything that is not a letter or a digit
 * becomes one space. "Stredne-hrubé", "STREDNE HRUBE" and "stredne  hrubé" are
 * one description written three ways, and a lexicon that matched only the
 * third would be a lexicon that works on the day it was written.
 */
export const normalizeForMatching = (text: string): string =>
  text
    .normalize(UNICODE_DECOMPOSED)
    .replace(COMBINING_MARKS, NOTHING)
    .toLowerCase()
    .replace(NON_LETTERS, SINGLE_SPACE)
    .trim();
