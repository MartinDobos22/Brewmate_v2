import {
  BREW_METHOD_CATEGORIES,
  type BrewConstraints,
  type BrewMethodCategory,
  type BrewParams,
  type BrewStep,
  type ConversionResult,
  type SourceRecipe,
  type WaterType,
} from '@brewmate/shared';

import type { ConversionAnswer } from './conversionAnswerSchema.js';

const NO_ESPRESSO = null;

export interface ConvertedRecipeContext {
  readonly source: SourceRecipe;
  readonly waterType: WaterType;
  readonly constraints: BrewConstraints;
  readonly targetCategory: BrewMethodCategory;
}

const toStep = (step: BrewStep): BrewStep => ({
  order: step.order,
  label: step.label,
  atSecond: step.atSecond,
  durationSeconds: step.durationSeconds,
  waterGrams: step.waterGrams,
  note: step.note,
});

/**
 * The arithmetic's answer and the model's words, joined into one recipe.
 *
 * Every number comes from the conversion and only from the conversion. The
 * answer contributes the grind in Slovak, the explanation, the hints, and - in
 * exactly the places the conversion reported a hole - a pour schedule and a
 * time. The schema already made anything else impossible; this is where that
 * division becomes visible.
 *
 * The conversion report is attached to the recipe rather than returned beside
 * it, because it is the difference between a grind number that is a starting
 * point and one that reads like a measurement, and a recipe reopened next
 * month has to still say which it is.
 */
export const toConvertedBrewParams = (
  result: ConversionResult,
  answer: ConversionAnswer,
  { source, waterType, constraints, targetCategory }: ConvertedRecipeContext,
): BrewParams => ({
  doseGrams: result.doseGrams,
  waterGrams: result.waterGrams,
  ratio: result.ratio,
  grindSetting: result.grindSetting,
  grindLabel: answer.grindLabel,
  waterTempC: result.waterTempC,
  waterType,
  steps: (result.scheduleMayBeRewritten ? (answer.steps ?? []) : result.steps).map(toStep),
  totalTimeSeconds: result.totalTimeSeconds ?? answer.totalTimeSeconds ?? null,
  constraints,
  constraintHints: [...answer.constraintHints],
  espresso:
    targetCategory === BREW_METHOD_CATEGORIES.espresso
      ? { preInfusionSeconds: result.preInfusionSeconds ?? answer.preInfusionSeconds ?? null }
      : NO_ESPRESSO,
  conversion: {
    source,
    notes: [...result.notes],
    grindMicrons: result.grindMicrons,
    grindDescriptor: result.grindDescriptor,
  },
});
