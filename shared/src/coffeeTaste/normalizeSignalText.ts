const NORMALIZATION_FORM = 'NFD';
const DIACRITICS = /\p{Diacritic}/gu;
const EMPTY = '';

/**
 * Lower case, no diacritics.
 *
 * Every lexicon here matches against this, so "Etiópia" and "etiopia" are the
 * same country and "čokoláda" and "cokolada" are the same note - which is what
 * a roaster printing an English word on a Slovak bag, or an optical reader
 * that dropped an accent, actually produces.
 */
export const normalizeSignalText = (text: string): string =>
  text.toLowerCase().normalize(NORMALIZATION_FORM).replace(DIACRITICS, EMPTY);
