import { DEFAULT_LOCALE } from '../../i18n/locales';

const MAX_FRACTION_DIGITS = 1;

/** Formats a measurable number for display, in the app's locale. */
export const formatDecimal = (value: number): string =>
  new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits: MAX_FRACTION_DIGITS,
  }).format(value);
