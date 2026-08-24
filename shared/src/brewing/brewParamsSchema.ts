import { z } from 'zod';

import { conversionReportSchema } from '../conversion/conversionReportSchema.js';
import { WATER_TYPES } from '../enums/waterTypes.js';

import { brewStepSchema } from './brewStepSchema.js';
import { brewConstraintsSchema } from './brewConstraintsSchema.js';
import { constraintHintSchema } from './constraintHintSchema.js';
import { espressoParamsSchema } from './espressoParamsSchema.js';
import {
  BREW_CONSTRAINT_HINTS_MAX,
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
  /**
   * The same grind, described rather than numbered.
   *
   * A number on its own is only an instruction to somebody whose grinder is in
   * the catalogue with a calibration behind it, which is a minority of
   * grinders and a minority of people. "Stredne hrubé, ako hrubší piesok" is
   * something anybody can act on, so it is stored beside the setting rather
   * than instead of it - a person with a Comandante gets both.
   */
  grindLabel: z.string().max(GRIND_LABEL_MAX_LENGTH).nullable().optional(),
  waterTempC: z.number().min(WATER_TEMP_C_MIN).max(WATER_TEMP_C_MAX).nullable(),
  waterType: z.enum(WATER_TYPES),
  steps: z.array(brewStepSchema).max(BREW_STEPS_MAX),
  /**
   * How long the whole brew should take.
   *
   * Optional rather than required, because it is the one number a recipe is
   * allowed not to have: a cold brew ends when somebody remembers it, and a
   * brew declared without a timer ends on a sight. Brew mode shows a stopwatch
   * where this is missing instead of a countdown to nothing.
   */
  totalTimeSeconds: z
    .number()
    .int()
    .min(BREW_DURATION_SECONDS_MIN)
    .max(BREW_DURATION_SECONDS_MAX)
    .nullable()
    .optional(),
  /**
   * What the brewer said they were missing when this recipe was written.
   *
   * Stored on the recipe as well as on the brew log, because the two answer
   * different questions. The log records what was true of one cup; this
   * records what the recipe was shaped around - which is what lets brew mode
   * fill the log in without asking again, and lets a conversation about a
   * recipe nobody has brewed yet still know what it may suggest.
   */
  constraints: brewConstraintsSchema.optional(),
  /**
   * What to do about each thing the brewer said they were missing.
   *
   * Stored with the recipe rather than returned once beside it, because these
   * are instructions: without a scale the dose above is unreachable and the
   * spoon measure underneath it is the recipe. A hint that lived only in the
   * response would vanish the moment somebody reopened the recipe tomorrow.
   */
  constraintHints: z.array(constraintHintSchema).max(BREW_CONSTRAINT_HINTS_MAX).optional(),
  /** Present only where the method is an espresso; see `espressoParamsSchema`. */
  espresso: espressoParamsSchema.nullable().optional(),
  /**
   * Where this recipe was converted from, and which of its numbers are guesses.
   *
   * Present only on an imported recipe. Stored rather than returned once,
   * because "the grind is a starting point, the dose is exact" is not a fact
   * about one response - it is a fact about this recipe, and a card reopened
   * next month that has quietly lost it has turned an estimate into a
   * measurement by doing nothing at all.
   */
  conversion: conversionReportSchema.nullable().optional(),
});

export type BrewParams = z.infer<typeof brewParamsSchema>;

/** What actually happened, or what a chat message proposes changing. */
export const partialBrewParamsSchema = brewParamsSchema.partial();

export type PartialBrewParams = z.infer<typeof partialBrewParamsSchema>;
