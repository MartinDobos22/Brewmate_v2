import {
  BREW_METHOD_CATEGORIES,
  BREW_STEPS_MAX,
  BREW_STEP_AT_SECOND_MIN,
  BREW_STEP_DURATION_SECONDS_MAX,
  BREW_STEP_DURATION_SECONDS_MIN,
  BREW_STEP_LABEL_MAX_LENGTH,
  BREW_STEP_NOTE_MAX_LENGTH,
  BREW_STEP_ORDER_MIN,
  BREW_CONSTRAINT_HINTS_MAX,
  BREW_DURATION_SECONDS_MAX,
  BREW_DURATION_SECONDS_MIN,
  GRIND_LABEL_MAX_LENGTH,
  GRIND_SETTING_MAX,
  GRIND_SETTING_MIN,
  PRE_INFUSION_SECONDS_MAX,
  PRE_INFUSION_SECONDS_MIN,
  RECIPE_RATIONALE_MAX_LENGTH,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  WATER_TEMP_C_MAX,
  WATER_TEMP_C_MIN,
  constraintHintSchema,
  type BrewMethodCategory,
} from '@brewmate/shared';
import { z } from 'zod';

const AT_LEAST_ONE = 1;

/** Which of the two shapes an answer is in. */
export const RECIPE_ANSWER_KINDS = {
  pour: 'pour',
  espresso: 'espresso',
} as const;

/**
 * One instruction, as the model is allowed to phrase it.
 *
 * The same bounds a stored step already obeys, so an answer that validates
 * here is an answer that fits in a recipe rather than one that fails a second
 * time on the way into the database.
 */
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
 * What every recipe answers, whatever it is brewed in.
 *
 * There is no dose, no water and no ratio anywhere in this schema, and that
 * absence is the enforcement. A rule in a prompt is a request; a field that
 * does not exist is a guarantee that the numbers the person chose come back
 * exactly as they set them.
 */
const commonAnswerFields = {
  grindSetting: z.number().min(GRIND_SETTING_MIN).max(GRIND_SETTING_MAX).nullable(),
  grindLabel: z.string().min(AT_LEAST_ONE).max(GRIND_LABEL_MAX_LENGTH),
  waterTempC: z.number().int().min(WATER_TEMP_C_MIN).max(WATER_TEMP_C_MAX).nullable(),
  totalTimeSeconds: z
    .number()
    .int()
    .min(BREW_DURATION_SECONDS_MIN)
    .max(BREW_DURATION_SECONDS_MAX)
    .nullable(),
  rationale: z.string().min(AT_LEAST_ONE).max(RECIPE_RATIONALE_MAX_LENGTH),
  constraintHints: z.array(constraintHintSchema).max(BREW_CONSTRAINT_HINTS_MAX),
};

/**
 * A dripper recipe without a pour schedule is not a recipe, so `steps` has a
 * minimum of one here. `preInfusionSeconds` is pinned to null rather than left
 * out, because leaving it out would let an espresso answer validate as a pour
 * one with the field quietly dropped.
 */
export const pourRecipeSchema = z.object({
  kind: z.literal(RECIPE_ANSWER_KINDS.pour),
  ...commonAnswerFields,
  steps: z.array(generatedStepSchema).min(AT_LEAST_ONE).max(BREW_STEPS_MAX),
  preInfusionSeconds: z.null(),
});

/**
 * An espresso is steered by grind, temperature and a target shot time, and
 * counting a two-stage shot down step by step would be theatre - so `steps`
 * may be empty and `totalTimeSeconds` is the number that carries the brew.
 */
export const espressoRecipeSchema = z.object({
  kind: z.literal(RECIPE_ANSWER_KINDS.espresso),
  ...commonAnswerFields,
  steps: z.array(generatedStepSchema).max(BREW_STEPS_MAX),
  preInfusionSeconds: z
    .number()
    .min(PRE_INFUSION_SECONDS_MIN)
    .max(PRE_INFUSION_SECONDS_MAX)
    .nullable(),
});

export type GeneratedRecipe =
  z.infer<typeof pourRecipeSchema> | z.infer<typeof espressoRecipeSchema>;

/**
 * Which shape this method's answer has to be in.
 *
 * The category decides it, not the model. Handing over the one schema the
 * answer is allowed to take - rather than a union that would accept either -
 * means an espresso answered with a bloom in it is a validation failure that
 * the single retry gets told about, instead of a recipe that reaches somebody
 * standing at a machine with no bloom to give it.
 */
export const resolveGeneratedRecipeSchema = (
  category: BrewMethodCategory,
): z.ZodType<GeneratedRecipe> =>
  category === BREW_METHOD_CATEGORIES.espresso ? espressoRecipeSchema : pourRecipeSchema;
