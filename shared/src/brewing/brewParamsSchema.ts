import { z } from 'zod';

import { WATER_TYPES } from '../enums/waterTypes.js';

import { brewStepSchema } from './brewStepSchema.js';
import {
  BREW_RATIO_MAX,
  BREW_RATIO_MIN,
  BREW_STEPS_MAX,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  GRIND_SETTING_MAX,
  GRIND_SETTING_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  WATER_TEMP_C_MAX,
  WATER_TEMP_C_MIN,
} from './brewingFieldLimits.js';

/**
 * Everything needed to brew one cup.
 *
 * Stored as `jsonb` rather than a column each: these change every time the
 * advice gets better, and a migration per parameter is not a way to run a
 * product. The shape is still validated at both ends - `jsonb` here does not
 * mean "anything goes".
 */
export const brewParamsSchema = z.object({
  doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX),
  waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX),
  ratio: z.number().min(BREW_RATIO_MIN).max(BREW_RATIO_MAX),
  /** In the grinder's own units; `null` for pre-ground coffee. */
  grindSetting: z.number().min(GRIND_SETTING_MIN).max(GRIND_SETTING_MAX).nullable(),
  waterTempC: z.number().min(WATER_TEMP_C_MIN).max(WATER_TEMP_C_MAX).nullable(),
  waterType: z.enum(WATER_TYPES),
  steps: z.array(brewStepSchema).max(BREW_STEPS_MAX),
});

export type BrewParams = z.infer<typeof brewParamsSchema>;

/** What actually happened, or what a chat message proposes changing. */
export const partialBrewParamsSchema = brewParamsSchema.partial();

export type PartialBrewParams = z.infer<typeof partialBrewParamsSchema>;
