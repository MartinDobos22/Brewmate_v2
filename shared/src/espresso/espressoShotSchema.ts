import { z } from 'zod';

import {
  SHOT_SECONDS_MAX,
  SHOT_SECONDS_MIN,
  SHOT_YIELD_GRAMS_MAX,
  SHOT_YIELD_GRAMS_MIN,
} from './espressoFieldLimits.js';
import { DOSE_GRAMS_MAX, DOSE_GRAMS_MIN } from '../brewing/brewingFieldLimits.js';

/**
 * What actually came out of the machine.
 *
 * Three numbers, because three numbers are what a person standing at a lever
 * can read off without putting the cup down: how long the pump ran, what
 * landed on the scale, and what went into the basket. How it tasted is a
 * sentence, and it travels as one rather than as a set of sliders nobody would
 * fill in twice.
 *
 * `doseGrams` is optional because it usually has not changed since the last
 * shot, and asking somebody to retype it every time is how a dial-in mode gets
 * abandoned halfway through.
 */
export const espressoShotSchema = z.object({
  doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX).nullable().optional(),
  yieldGrams: z.number().min(SHOT_YIELD_GRAMS_MIN).max(SHOT_YIELD_GRAMS_MAX),
  timeSeconds: z.number().int().min(SHOT_SECONDS_MIN).max(SHOT_SECONDS_MAX),
});

export type EspressoShot = z.infer<typeof espressoShotSchema>;
