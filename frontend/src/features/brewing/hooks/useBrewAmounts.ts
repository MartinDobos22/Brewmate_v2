import { useEffect, useRef, useState } from 'react';
import type { BrewMethod, Equipment, MethodHabit } from '@brewmate/shared';

import { REFERENCE_RECIPE } from '../constants/referenceRecipe';
import { AMOUNT_FIELDS } from '../constants/preBrew';
import {
  isEspressoMethod,
  midpointRatio,
  setDose,
  setRatio,
  setWater,
  type BrewAmounts,
} from '../services/resolveBrewAmounts';
import { proposeBrewAmounts } from '../services/proposeBrewAmounts';

export interface BrewAmountsControl {
  readonly amounts: BrewAmounts;
  readonly isEspresso: boolean;
  /**
   * What this person's own cups say about the method, where they say anything.
   *
   * Carried so the card can say where its proposal came from: the method's
   * middle and somebody's habit are two different claims, and a proposal that
   * does not say which it is reads as the app's opinion either way.
   */
  readonly habit: MethodHabit | null;
  readonly setDoseGrams: (grams: number) => void;
  readonly setWaterGrams: (grams: number) => void;
  readonly setRatioValue: (ratio: number) => void;
}

const NEUTRAL_AMOUNTS: BrewAmounts = {
  doseGrams: REFERENCE_RECIPE.doseGrams,
  waterGrams: REFERENCE_RECIPE.doseGrams * REFERENCE_RECIPE.midpointDivisor,
  ratio: REFERENCE_RECIPE.midpointDivisor,
  lastEdited: AMOUNT_FIELDS.dose,
};

/**
 * The three numbers, and the proposal they start from.
 *
 * Seeded rather than left blank: an empty form is a question, and this screen
 * has already asked enough of them. The proposal is the middle of the method's
 * own ratio window at a dose the brewer can take - unremarkable on purpose, so
 * that whatever the drinker changes reads as a decision rather than as
 * correcting the app.
 *
 * Re-seeded when the method or the brewer changes, because the proposal is
 * about that pair: switching from a V60 to an espresso basket and keeping
 * three hundred grams of water would be an obvious nonsense left on screen.
 * Once somebody has touched a number the seed is behind them, which is why
 * this watches the method rather than the amounts.
 *
 * It also watches the habit's two figures, because the profile can arrive a
 * moment after the method on a cold cache - and a proposal seeded from the
 * middle and never corrected would print "tak zvykneš variť" under numbers
 * that are not theirs. Only until somebody touches a number, though: a
 * profile refreshed because an offline cup finally synced must not quietly
 * rewrite a dose somebody has just typed.
 */
export const useBrewAmounts = (
  method: BrewMethod | undefined,
  brewer: Equipment | undefined,
  habit: MethodHabit | null,
): BrewAmountsControl => {
  const [amounts, setAmounts] = useState<BrewAmounts>(NEUTRAL_AMOUNTS);
  const isTouched = useRef(false);
  const methodId = method?.id;
  const brewerId = brewer?.id;
  const habitDose = habit?.doseGrams;
  const habitRatio = habit?.ratio;

  useEffect((): void => {
    if (method === undefined) {
      return;
    }

    isTouched.current = false;
    setAmounts(proposeBrewAmounts(method, brewer, habit));
    // The proposal belongs to the (method, brewer) pair, so it is re-made when
    // that pair changes and never because a number underneath it moved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodId, brewerId]);

  useEffect((): void => {
    if (method === undefined || isTouched.current) {
      return;
    }

    setAmounts(proposeBrewAmounts(method, brewer, habit));
    // Only the habit's own figures: this is the late arrival of the profile,
    // not a new pair, and it yields to anything somebody already typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitDose, habitRatio]);

  const edit = (next: BrewAmounts): void => {
    isTouched.current = true;
    setAmounts(next);
  };

  return {
    amounts,
    isEspresso: isEspressoMethod(method),
    habit,
    setDoseGrams: (grams: number): void => {
      edit(setDose(amounts, grams));
    },
    setWaterGrams: (grams: number): void => {
      edit(setWater(amounts, grams));
    },
    setRatioValue: (ratio: number): void => {
      edit(setRatio(amounts, ratio));
    },
  };
};

export { midpointRatio };
