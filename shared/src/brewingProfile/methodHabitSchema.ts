import { z } from 'zod';

import {
  BREW_RATIO_MAX,
  BREW_RATIO_MIN,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  WATER_TEMP_C_MAX,
  WATER_TEMP_C_MIN,
} from '../brewing/brewingFieldLimits.js';

const NOTHING = 0;

/**
 * How somebody brews one method, read off the cups they made with it.
 *
 * Per method rather than per family, because these are figures about a
 * brewer: an AeroPress and a French press are both immersion and nobody puts
 * the same dose in both. Each figure is null until enough cups stand behind
 * it, independently - somebody with no thermometer has a dose habit long
 * before they have a temperature one, and never will have the second.
 */
export const methodHabitSchema = z.object({
  methodId: z.uuid(),
  /** Every cup brewed with this method in the window read, whatever it taught. */
  cupCount: z.number().int().min(NOTHING),
  doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX).nullable(),
  ratio: z.number().min(BREW_RATIO_MIN).max(BREW_RATIO_MAX).nullable(),
  waterTempC: z.number().min(WATER_TEMP_C_MIN).max(WATER_TEMP_C_MAX).nullable(),
});

export type MethodHabit = z.infer<typeof methodHabitSchema>;
