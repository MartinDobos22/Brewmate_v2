import {
  resolveRatio,
  type BrewConstraints,
  type BrewParams,
  type BrewStep,
  type WaterType,
} from '@brewmate/shared';

import { RECIPE_ANSWER_KINDS, type GeneratedRecipe } from './generatedRecipeSchema.js';

const NO_ESPRESSO = null;

export interface ChosenBrewAmounts {
  readonly doseGrams: number;
  readonly waterGrams: number;
  readonly waterType: WaterType;
  readonly constraints: BrewConstraints;
}

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
  { doseGrams, waterGrams, waterType, constraints }: ChosenBrewAmounts,
): BrewParams => ({
  doseGrams,
  waterGrams,
  ratio: resolveRatio(doseGrams, waterGrams),
  grindSetting: answer.grindSetting,
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
