import { z } from 'zod';

import {
  BREW_STEP_AT_SECOND_MIN,
  BREW_STEP_LABEL_MAX_LENGTH,
  BREW_STEP_NOTE_MAX_LENGTH,
  BREW_STEP_ORDER_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
} from './brewingFieldLimits.js';

/** One instruction in a recipe: bloom, first pour, swirl, drawdown. */
export const brewStepSchema = z.object({
  order: z.number().int().min(BREW_STEP_ORDER_MIN),
  label: z.string().min(1).max(BREW_STEP_LABEL_MAX_LENGTH),
  /** When the step starts, counted from the first drop of water. */
  atSecond: z.number().int().min(BREW_STEP_AT_SECOND_MIN).nullable(),
  /** Cumulative water on the scale at the end of this step. */
  waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX).nullable(),
  note: z.string().max(BREW_STEP_NOTE_MAX_LENGTH).nullable(),
});

export type BrewStep = z.infer<typeof brewStepSchema>;
