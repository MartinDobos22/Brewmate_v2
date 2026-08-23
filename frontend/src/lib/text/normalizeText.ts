const NORMALIZATION_FORM = 'NFD';
const DIACRITICS = /\p{Diacritic}/gu;
const EMPTY = '';

/**
 * Lower case, no diacritics.
 *
 * Every lexicon in the app matches against this, so "kyslá" and "kysla" are
 * the same word - which is what somebody typing quickly on a phone, or a
 * roaster printing an English note on a Slovak bag, actually produces.
 */
export const normalizeText = (text: string): string =>
  text.toLowerCase().normalize(NORMALIZATION_FORM).replace(DIACRITICS, EMPTY);
