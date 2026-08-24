import {
  resolveRatio,
  resolveWaterGrams,
  type BrewParams,
  type BrewStep,
  type RecipePatch,
} from '@brewmate/shared';

import type { CoachAnswer, CoachStep } from './coachAnswerSchema.js';

const NOTHING = 0;

const toStep = (step: CoachStep): BrewStep => ({
  order: step.order,
  label: step.label,
  atSecond: step.atSecond,
  durationSeconds: step.durationSeconds,
  waterGrams: step.waterGrams,
  note: step.note,
});

/**
 * The proposal, as the conversation stores it.
 *
 * The ratio is recomputed from whatever the dose and the water end up being
 * rather than taken from the answer, for the same reason the engine recomputes
 * it: grams are the physical fact and a ratio is arithmetic over them. A patch
 * that moved the water and left a stale ratio behind would show a diff with
 * two rows that contradict each other, and the row somebody checks on a scale
 * is always the one in grams.
 *
 * @returns the patch, or null when the answer proposed no change or a change
 * that turns out to be nothing at all.
 */
export const toRecipePatch = (answer: CoachAnswer, current: BrewParams): RecipePatch | null => {
  const proposed = answer.recipePatch;

  if (proposed === null) {
    return null;
  }

  const doseGrams = proposed.doseGrams ?? current.doseGrams;
  const movedAmounts = proposed.doseGrams !== undefined || proposed.waterGrams !== undefined;
  /**
   * A ratio on its own moves the water, never the dose.
   *
   * The dose is what somebody weighed out and probably already tipped into the
   * brewer; the water is still in the kettle. Changing the third number and
   * leaving the other two alone would put a recipe on screen whose own
   * arithmetic does not hold.
   */
  const amounts = movedAmounts
    ? {
        ...(proposed.doseGrams === undefined ? {} : { doseGrams: proposed.doseGrams }),
        ...(proposed.waterGrams === undefined ? {} : { waterGrams: proposed.waterGrams }),
        ratio: resolveRatio(doseGrams, proposed.waterGrams ?? current.waterGrams),
      }
    : proposed.ratio === undefined
      ? {}
      : { waterGrams: resolveWaterGrams(doseGrams, proposed.ratio), ratio: proposed.ratio };

  const params = {
    ...amounts,
    ...(proposed.grindSetting === undefined ? {} : { grindSetting: proposed.grindSetting }),
    ...(proposed.grindLabel === undefined ? {} : { grindLabel: proposed.grindLabel }),
    ...(proposed.waterTempC === undefined ? {} : { waterTempC: proposed.waterTempC }),
    ...(proposed.totalTimeSeconds === undefined
      ? {}
      : { totalTimeSeconds: proposed.totalTimeSeconds }),
    ...(proposed.steps === undefined ? {} : { steps: proposed.steps.map(toStep) }),
  };

  if (Object.keys(params).length === NOTHING && proposed.rationale === undefined) {
    return null;
  }

  return {
    params,
    ...(proposed.rationale === undefined ? {} : { rationale: proposed.rationale }),
  };
};
