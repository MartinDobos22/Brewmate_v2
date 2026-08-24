import type { EspressoShot } from '@brewmate/shared';

const EMPTY = '';
const DECIMAL_COMMA = ',';
const DECIMAL_POINT = '.';

/** What somebody reads off the scale and the clock, as they type it. */
export interface ShotFormValues {
  readonly timeSeconds: string;
  readonly yieldGrams: string;
  readonly doseGrams: string;
  readonly taste: string;
}

export const EMPTY_SHOT_FORM: ShotFormValues = {
  timeSeconds: EMPTY,
  yieldGrams: EMPTY,
  doseGrams: EMPTY,
  taste: EMPTY,
};

const readNumber = (text: string): number | null => {
  const trimmed = text.trim().replace(DECIMAL_COMMA, DECIMAL_POINT);

  if (trimmed === EMPTY) {
    return null;
  }

  const value = Number(trimmed);

  return Number.isFinite(value) ? value : null;
};

/**
 * The two numbers a shot cannot be read without.
 *
 * The dose is not among them: it usually has not changed since the last shot,
 * and asking somebody to retype it every time is how a dial-in gets abandoned
 * halfway through. Where they leave it empty the recipe's own dose stands.
 */
export const toEspressoShot = (values: ShotFormValues): EspressoShot | null => {
  const timeSeconds = readNumber(values.timeSeconds);
  const yieldGrams = readNumber(values.yieldGrams);

  if (timeSeconds === null || yieldGrams === null) {
    return null;
  }

  return {
    timeSeconds: Math.round(timeSeconds),
    yieldGrams,
    doseGrams: readNumber(values.doseGrams),
  };
};
