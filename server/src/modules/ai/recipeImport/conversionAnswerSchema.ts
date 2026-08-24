import {
  BREW_CONSTRAINT_HINTS_MAX,
  BREW_DURATION_SECONDS_MAX,
  BREW_DURATION_SECONDS_MIN,
  BREW_METHOD_CATEGORIES,
  BREW_STEPS_MAX,
  BREW_STEP_AT_SECOND_MIN,
  BREW_STEP_DURATION_SECONDS_MAX,
  BREW_STEP_DURATION_SECONDS_MIN,
  BREW_STEP_LABEL_MAX_LENGTH,
  BREW_STEP_NOTE_MAX_LENGTH,
  BREW_STEP_ORDER_MIN,
  GRIND_LABEL_MAX_LENGTH,
  PRE_INFUSION_SECONDS_MAX,
  PRE_INFUSION_SECONDS_MIN,
  RECIPE_RATIONALE_MAX_LENGTH,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  constraintHintSchema,
  type BrewMethodCategory,
  type BrewStep,
  type ConstraintHint,
  type ConversionResult,
} from '@brewmate/shared';
import { z } from 'zod';

const AT_LEAST_ONE = 1;

const generatedStepSchema = z.object({
  order: z.number().int().min(BREW_STEP_ORDER_MIN),
  label: z.string().min(AT_LEAST_ONE).max(BREW_STEP_LABEL_MAX_LENGTH),
  atSecond: z.number().int().min(BREW_STEP_AT_SECOND_MIN).nullable(),
  durationSeconds: z
    .number()
    .int()
    .min(BREW_STEP_DURATION_SECONDS_MIN)
    .max(BREW_STEP_DURATION_SECONDS_MAX)
    .nullable(),
  waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX).nullable(),
  note: z.string().max(BREW_STEP_NOTE_MAX_LENGTH).nullable(),
});

/**
 * A field the arithmetic already answered may not appear at all.
 *
 * Only an absent key validates - not even an explicit null, which would read
 * as "clear this". The same guarantee the recipe engine gets by having no dose
 * field, applied to a longer list: everything the conversion computed is
 * closed, and what is left open is exactly the holes it reported.
 */
const forbidden = (): z.ZodType<undefined> => z.never().optional();

/**
 * What the model is allowed to add to a converted recipe.
 *
 * Deliberately almost nothing. The dose, the water, the ratio, the grind
 * setting, the temperature and - wherever they came across intact - the pour
 * schedule and the times are arithmetic, and there is no field here to put any
 * of them in. What is left is the two things arithmetic genuinely cannot do:
 * say the grind in Slovak words a person can act on, and explain what was
 * converted exactly and what was estimated, in a way somebody standing at a
 * counter can use.
 */
export interface ConversionAnswer {
  readonly grindLabel: string | null;
  readonly rationale: string;
  readonly constraintHints: readonly ConstraintHint[];
  readonly steps?: readonly BrewStep[];
  readonly totalTimeSeconds?: number | null;
  readonly preInfusionSeconds?: number | null;
}

export interface ConversionAnswerShape {
  readonly result: ConversionResult;
  readonly targetCategory: BrewMethodCategory;
}

/**
 * The answer's shape, built from what the conversion could not work out.
 *
 * A schedule written for a different family of brewer does not carry over, and
 * that hole is the one thing worth asking a model to fill: the arithmetic can
 * scale a V60's three pours, but it cannot invent a portafilter routine out of
 * them. So `steps` opens exactly when the conversion reported the schedule as
 * dropped, and stays shut - not merely discouraged - when it did not.
 *
 * Building the shape this way rather than checking the answer afterwards means
 * a model that tries to improve a converted dose fails validation and gets one
 * retry with the reason, instead of quietly winning an argument with a person
 * who chose those numbers.
 */
export const resolveConversionAnswerSchema = ({
  result,
  targetCategory,
}: ConversionAnswerShape): z.ZodType<ConversionAnswer> => {
  const mayWriteSchedule = result.scheduleMayBeRewritten;
  const mayWriteTime = result.totalTimeSeconds === null;
  const isEspresso = targetCategory === BREW_METHOD_CATEGORIES.espresso;
  const mayWritePreInfusion = isEspresso && result.preInfusionSeconds === null;

  return z.object({
    grindLabel:
      result.grindMicrons === null
        ? z.null()
        : z.string().min(AT_LEAST_ONE).max(GRIND_LABEL_MAX_LENGTH),
    rationale: z.string().min(AT_LEAST_ONE).max(RECIPE_RATIONALE_MAX_LENGTH),
    constraintHints: z.array(constraintHintSchema).max(BREW_CONSTRAINT_HINTS_MAX),
    steps: mayWriteSchedule
      ? z.array(generatedStepSchema).max(BREW_STEPS_MAX).optional()
      : forbidden(),
    totalTimeSeconds: mayWriteTime
      ? z
          .number()
          .int()
          .min(BREW_DURATION_SECONDS_MIN)
          .max(BREW_DURATION_SECONDS_MAX)
          .nullable()
          .optional()
      : forbidden(),
    preInfusionSeconds: mayWritePreInfusion
      ? z.number().min(PRE_INFUSION_SECONDS_MIN).max(PRE_INFUSION_SECONDS_MAX).nullable().optional()
      : forbidden(),
  });
};
