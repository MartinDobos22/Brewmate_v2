import { formatDecimal } from './formatDecimal';

/** A dose or a yield, without its unit - the unit comes from i18n. */
export const formatGrams = (grams: number): string => formatDecimal(grams);
