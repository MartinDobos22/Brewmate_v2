import {
  resolveRatio,
  snapToStep,
  type BrewConstraints,
  type BrewParams,
  type BrewStep,
  type Grinder,
  type WaterType,
} from '@brewmate/shared';

import { RECIPE_ANSWER_KINDS, type GeneratedRecipe } from './generatedRecipeSchema.js';

const NO_ESPRESSO = null;

export interface ChosenBrewAmounts {
  readonly doseGrams: number;
  readonly waterGrams: number;
  readonly waterType: WaterType;
  readonly constraints: BrewConstraints;
  /** The catalogue entry behind their grinder, where there is one. */
  readonly grinder: Grinder | null;
}

/**
 * The nearest setting the collar can actually be left at.
 *
 * A clicked grinder has detents, and 22.4 on a forty-click collar is not a
 * setting anybody can dial - it is a number that makes somebody guess which
 * of the two neighbouring clicks was meant, which is the one thing a recipe
 * card must never do. Clamped to the collar's own ends for the same reason: a
 * grinder cannot be turned past where it stops.
 *
 * Nothing here is the model being overruled. The number it chose is kept; it
 * is only rounded to something that exists on the object in front of the
 * person reading it.
 */
const toDialableSetting = (setting: number | null, grinder: Grinder | null): number | null => {
  if (setting === null || grinder === null) {
    return setting;
  }

  return snapToStep(
    Math.min(Math.max(setting, grinder.minSetting), grinder.maxSetting),
    grinder.step,
    grinder.minSetting,
  );
};

const toStep = (step: GeneratedRecipe['steps'][number]): BrewStep => ({
  order: step.order,
  label: step.label,
  atSecond: step.atSecond,
  durationSeconds: step.durationSeconds,
  waterGrams: step.waterGrams,
  note: step.note,
});

/**
 * The answer and the person's own numbers, joined into one recipe.
 *
 * The dose and the water come from the request and only from the request. The
 * ratio is recomputed from them rather than copied out of the request as well,
 * because grams are the physical fact and a ratio is arithmetic over them: a
 * ratio that arrived rounded one way and a dose and water that divide the
 * other way would put two numbers on the recipe card that disagree, and the
 * one somebody notices is always the one they can check on a scale.
 *
 * Both answer shapes land in the same `BrewParams`, which is what keeps every
 * screen that reads a recipe from having to ask which kind it is holding
 * first. An espresso's yield is `waterGrams` because that is literally what
 * ends up on the scale, and its target time is `totalTimeSeconds` for the same
 * reason a pour-over's is.
 */
export const toBrewParams = (
  answer: GeneratedRecipe,
  { doseGrams, waterGrams, waterType, constraints, grinder }: ChosenBrewAmounts,
): BrewParams => ({
  doseGrams,
  waterGrams,
  ratio: resolveRatio(doseGrams, waterGrams),
  grindSetting: toDialableSetting(answer.grindSetting, grinder),
  grindLabel: answer.grindLabel,
  waterTempC: answer.waterTempC,
  waterType,
  constraints,
  steps: answer.steps.map(toStep),
  totalTimeSeconds: answer.totalTimeSeconds,
  constraintHints: answer.constraintHints,
  espresso:
    answer.kind === RECIPE_ANSWER_KINDS.espresso
      ? { preInfusionSeconds: answer.preInfusionSeconds }
      : NO_ESPRESSO,
});
