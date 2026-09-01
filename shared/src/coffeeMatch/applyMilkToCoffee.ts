import type { MilkUsage } from '../enums/milkUsage.js';
import { TASTE_AXIS_MAX, TASTE_AXIS_MIN } from '../tasteProfiles/tasteProfileFieldLimits.js';
import type { TasteAxes } from '../tasteProfiles/tasteAxesSchema.js';

import { MILK_SHARE, MILK_SHIFT } from './constants/milkAdjustment.js';

const NO_MILK = 0;

const clamp = (value: number): number => Math.min(Math.max(value, TASTE_AXIS_MIN), TASTE_AXIS_MAX);

/**
 * The coffee as this person will actually drink it.
 *
 * A label can only ever describe the coffee brewed black, and a profile always
 * describes the cup somebody puts to their mouth. For most people those are
 * the same thing and this does nothing at all. For somebody who always drinks
 * a flat white they are two different drinks, and comparing them directly is
 * how an app ends up telling a latte drinker that every interesting coffee on
 * the shelf is too sharp for them.
 *
 * Applied to the coffee rather than to the profile on purpose. The profile is
 * evidence about a person and must not be rewritten by an inference; the
 * estimate is a prediction about a cup, and predicting the cup they will
 * actually pour is the whole job.
 */
export const applyMilkToCoffee = (axes: TasteAxes, milkUsage: MilkUsage | null): TasteAxes => {
  const share = milkUsage === null ? NO_MILK : MILK_SHARE[milkUsage];

  if (share === NO_MILK) {
    return axes;
  }

  return {
    acidity: clamp(axes.acidity + MILK_SHIFT.acidity * share),
    sweetness: clamp(axes.sweetness + MILK_SHIFT.sweetness * share),
    body: clamp(axes.body + MILK_SHIFT.body * share),
    bitterness: clamp(axes.bitterness + MILK_SHIFT.bitterness * share),
    intensity: clamp(axes.intensity + MILK_SHIFT.intensity * share),
  };
};
