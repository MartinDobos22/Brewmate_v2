import { z } from 'zod';

import {
  BREW_STEP_AT_SECOND_MIN,
  BREW_STEP_DURATION_SECONDS_MAX,
  BREW_STEP_DURATION_SECONDS_MIN,
  BREW_STEP_LABEL_MAX_LENGTH,
  BREW_STEP_NOTE_MAX_LENGTH,
  BREW_STEP_ORDER_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
} from './brewingFieldLimits.js';

/**
 * One instruction in a recipe: bloom, first pour, swirl, drawdown.
 *
 * `atSecond` and `durationSeconds` are both stored, although the second could
 * be derived from the next step's start. Brew mode counts one step down at a
 * time and the last step has no successor to subtract from, so deriving it
 * would leave exactly the step somebody is standing over without a number.
 *
 * Both are nullable, and that is the shape a brew without a clock takes: the
 * instruction then has to carry the signal to watch for instead of a time, and
 * a step with no duration is one brew mode waits for a tap on rather than
 * counting.
 */
export const brewStepSchema = z.object({
  order: z.number().int().min(BREW_STEP_ORDER_MIN),
  label: z.string().min(1).max(BREW_STEP_LABEL_MAX_LENGTH),
  /** When the step starts, counted from the first drop of water. */
  atSecond: z.number().int().min(BREW_STEP_AT_SECOND_MIN).nullable(),
  /** How long it lasts. Null where the step ends on a sight, not a clock. */
  durationSeconds: z
    .number()
    .int()
    .min(BREW_STEP_DURATION_SECONDS_MIN)
    .max(BREW_STEP_DURATION_SECONDS_MAX)
    .nullable()
    .optional(),
  /** Cumulative water on the scale at the end of this step. */
  waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX).nullable(),
  note: z.string().max(BREW_STEP_NOTE_MAX_LENGTH).nullable(),
});

export type BrewStep = z.infer<typeof brewStepSchema>;
