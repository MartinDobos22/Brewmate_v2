import { z } from 'zod';

import { BREW_METHOD_CATEGORIES } from '../enums/brewMethodCategories.js';
import {
  BREW_DURATION_SECONDS_MAX,
  BREW_DURATION_SECONDS_MIN,
  BREW_RATIO_MAX,
  BREW_RATIO_MIN,
  BREW_STEPS_MAX,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  GRIND_LABEL_MAX_LENGTH,
  GRIND_SETTING_MAX,
  GRIND_SETTING_MIN,
  PRE_INFUSION_SECONDS_MAX,
  PRE_INFUSION_SECONDS_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  WATER_TEMP_C_MAX,
  WATER_TEMP_C_MIN,
} from '../brewing/brewingFieldLimits.js';
import { brewStepSchema } from '../brewing/brewStepSchema.js';
import { GRIND_MICRONS_MAX, GRIND_MICRONS_MIN } from '../grinders/grinderFieldLimits.js';

import { SOURCE_RECIPE_LABEL_MAX_LENGTH } from './conversionFieldLimits.js';

/**
 * Somebody else's recipe, as far as anybody knows it.
 *
 * Every field is nullable, and that is the honest shape of the thing: a recipe
 * read off a video description is usually a dose, a water weight and a grind
 * described in words, and inventing the rest of it would be inventing exactly
 * the numbers this conversion exists to be careful about.
 *
 * `grinderId` points at the catalogue when the source named a grinder Brewmate
 * knows. Without it the grind has to be recovered from `grindLabel` or, failing
 * that, from what the method normally wants - which the conversion says out
 * loud rather than quietly.
 */
export const sourceRecipeSchema = z.object({
  /** What the recipe was called where it came from, for the record. */
  label: z.string().max(SOURCE_RECIPE_LABEL_MAX_LENGTH).nullable(),
  /** The family of brewer it was written for, when that is known. */
  methodCategory: z.enum(BREW_METHOD_CATEGORIES).nullable(),
  doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX).nullable(),
  waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX).nullable(),
  ratio: z.number().min(BREW_RATIO_MIN).max(BREW_RATIO_MAX).nullable(),
  /** The catalogue entry for the grinder the recipe was written on. */
  grinderId: z.uuid().nullable(),
  /** A setting on that grinder's own collar, meaningless without the grinder. */
  grindSetting: z.number().min(GRIND_SETTING_MIN).max(GRIND_SETTING_MAX).nullable(),
  /** The grind as the recipe described it: "medium-fine", "ako morská soľ". */
  grindLabel: z.string().max(GRIND_LABEL_MAX_LENGTH).nullable(),
  /** A particle size stated outright, which a few recipes actually do. */
  grindMicrons: z.number().min(GRIND_MICRONS_MIN).max(GRIND_MICRONS_MAX).nullable(),
  waterTempC: z.number().min(WATER_TEMP_C_MIN).max(WATER_TEMP_C_MAX).nullable(),
  totalTimeSeconds: z
    .number()
    .int()
    .min(BREW_DURATION_SECONDS_MIN)
    .max(BREW_DURATION_SECONDS_MAX)
    .nullable(),
  preInfusionSeconds: z
    .number()
    .min(PRE_INFUSION_SECONDS_MIN)
    .max(PRE_INFUSION_SECONDS_MAX)
    .nullable(),
  steps: z.array(brewStepSchema).max(BREW_STEPS_MAX),
});

export type SourceRecipe = z.infer<typeof sourceRecipeSchema>;

/** A recipe nobody has read yet: every field open, no steps. */
export const EMPTY_SOURCE_RECIPE: SourceRecipe = {
  label: null,
  methodCategory: null,
  doseGrams: null,
  waterGrams: null,
  ratio: null,
  grinderId: null,
  grindSetting: null,
  grindLabel: null,
  grindMicrons: null,
  waterTempC: null,
  totalTimeSeconds: null,
  preInfusionSeconds: null,
  steps: [],
};
