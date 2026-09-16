const DECIMAL_SEPARATORS = /[,.]/gu;
const NON_NUMERIC = /[^0-9.]/gu;
const CANONICAL_SEPARATOR = '.';
const EMPTY = '';
const NEGATIVE = 0;

/**
 * The inverse of `formatDecimal`, and deliberately its neighbour.
 *
 * Kept beside the formatter so the two cannot disagree about what a decimal
 * point looks like: Slovak writes 229,6 and the phone's own keypad offers
 * whichever separator its locale was set to, so both are accepted. Everything
 * else is dropped rather than refused, because this reads a field somebody is
 * still typing into - the thousands space `Intl` inserts, a stray unit, a
 * second comma from a fat thumb.
 *
 * @returns null where nothing numeric was typed at all, which includes the
 *   empty field somebody is halfway through clearing. A caller must leave the
 *   value alone there rather than treating it as a nought - a dose of zero is
 *   not what "I deleted the digits before typing new ones" means.
 */
export const parseDecimal = (text: string): number | null => {
  const canonical = text
    .replace(DECIMAL_SEPARATORS, CANONICAL_SEPARATOR)
    .replace(NON_NUMERIC, EMPTY);

  if (canonical === EMPTY) {
    return null;
  }

  const value = Number.parseFloat(canonical);

  return Number.isFinite(value) && value >= NEGATIVE ? value : null;
};
