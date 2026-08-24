import {
  DIAL_IN_CHANGES,
  resolveRatio,
  type BrewParams,
  type PartialBrewParams,
  type RecipePatch,
} from '@brewmate/shared';

import type { DialInAnswer } from './dialInAnswerSchema.js';

const NOTHING = 0;

/**
 * The next shot, as the conversation stores it.
 *
 * The dose moving takes the ratio with it, because on an espresso the ratio is
 * dose against yield and the yield is what they pull to - so a heavier dose at
 * the same yield really is a tighter ratio, and a card that showed the old one
 * would contradict the scale. The grind moving takes nothing with it: it
 * changes how long the same weights take, which is the whole reason it is the
 * first lever.
 *
 * @returns the patch, or null when the answer proposed no change - which is a
 * real answer and the one that ends a dial-in.
 */
export const toDialInPatch = (answer: DialInAnswer, current: BrewParams): RecipePatch | null => {
  const params: PartialBrewParams =
    answer.change === DIAL_IN_CHANGES.grind
      ? {
          grindSetting: answer.grindSetting,
          ...(answer.grindLabel === undefined ? {} : { grindLabel: answer.grindLabel }),
        }
      : answer.change === DIAL_IN_CHANGES.dose && answer.doseGrams !== undefined
        ? {
            doseGrams: answer.doseGrams,
            ratio: resolveRatio(answer.doseGrams, current.waterGrams),
          }
        : {};

  if (Object.keys(params).length === NOTHING) {
    return null;
  }

  return { params, ...(answer.rationale === undefined ? {} : { rationale: answer.rationale }) };
};
