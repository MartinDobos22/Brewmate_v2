import { DEFAULT_LOCALE } from '../../i18n/locales';

const MIN_FRACTION_DIGITS = 2;
const MAX_FRACTION_DIGITS = 4;

/**
 * A cost, which arrives as a decimal string and stays one until here.
 *
 * The API sends `numeric` as text precisely so that a month of fractions of a
 * cent can be summed exactly, and the only place that number becomes a float
 * is the last step before somebody reads it. Four decimals rather than two,
 * because a single scan really does cost less than a cent and rounding it to
 * "0,00" would make the busiest screen in this feature read as free.
 */
export const formatCost = (amount: string): string =>
  new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: MIN_FRACTION_DIGITS,
    maximumFractionDigits: MAX_FRACTION_DIGITS,
  }).format(Number(amount));
