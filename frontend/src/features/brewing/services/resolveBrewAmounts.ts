import {
  BREW_METHOD_CATEGORIES,
  clampDoseGrams,
  clampWaterGrams,
  resolveDoseGrams,
  resolveRatio,
  resolveWaterGrams,
  type BrewMethod,
} from '@brewmate/shared';

import { AMOUNT_FIELDS, type AmountField } from '../constants/preBrew';

export interface BrewAmounts {
  readonly doseGrams: number;
  readonly waterGrams: number;
  readonly ratio: number;
  /** Which of the two weights the person touched most recently. */
  readonly lastEdited: AmountField;
}

/**
 * The calculator, in three directions.
 *
 * Coffee, water and the ratio between them are three views of two facts, so
 * changing any one of them has to move exactly one of the others - and which
 * one is the whole design. Typing a dose moves the water. Typing a water
 * weight moves the ratio, because the two weights are what somebody has
 * actually got. Moving the ratio moves whichever weight was *not* touched
 * last: somebody who has just weighed seventeen grams into the brewer and then
 * reaches for a tighter ratio means "more water", not "go and weigh the coffee
 * again".
 *
 * The arithmetic itself lives in `@brewmate/shared`, so the number this screen
 * shows and the number the API stores are rounded by the same code.
 */
/*
 * Both weights are clamped on the way in, not only on the way out.
 *
 * The derived number always was; the entered one did not have to be while the
 * only way to enter it was a stepper walking half a gram at a time away from a
 * proposal. A keypad reaches zero on the way to every figure whose first digit
 * has not been pressed yet, and a dose of nought is a ratio of infinity and a
 * 422 from the API on a screen that looked perfectly well.
 */
export const setDose = (amounts: BrewAmounts, entered: number): BrewAmounts => {
  const doseGrams = clampDoseGrams(entered);

  return {
    doseGrams,
    ratio: amounts.ratio,
    waterGrams: resolveWaterGrams(doseGrams, amounts.ratio),
    lastEdited: AMOUNT_FIELDS.dose,
  };
};

export const setWater = (amounts: BrewAmounts, entered: number): BrewAmounts => {
  const waterGrams = clampWaterGrams(entered);

  return {
    doseGrams: amounts.doseGrams,
    waterGrams,
    ratio: resolveRatio(amounts.doseGrams, waterGrams),
    lastEdited: AMOUNT_FIELDS.water,
  };
};

export const setRatio = (amounts: BrewAmounts, ratio: number): BrewAmounts =>
  amounts.lastEdited === AMOUNT_FIELDS.water
    ? {
        doseGrams: resolveDoseGrams(amounts.waterGrams, ratio),
        waterGrams: amounts.waterGrams,
        ratio,
        lastEdited: amounts.lastEdited,
      }
    : {
        doseGrams: amounts.doseGrams,
        waterGrams: resolveWaterGrams(amounts.doseGrams, ratio),
        ratio,
        lastEdited: amounts.lastEdited,
      };

/**
 * An espresso's second number is the yield in the cup, not water poured over
 * coffee - so it is measured in the same grams and labelled differently.
 */
export const isEspressoMethod = (method: BrewMethod | undefined): boolean =>
  method?.category === BREW_METHOD_CATEGORIES.espresso;

/** The middle of the method's own window, which is where a proposal belongs. */
const MIDPOINT_DIVISOR = 2;

export const midpointRatio = (method: BrewMethod): number =>
  (method.defaultRatioRange.min + method.defaultRatioRange.max) / MIDPOINT_DIVISOR;
