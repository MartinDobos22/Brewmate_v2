import {
  BREW_RATIO_MAX,
  BREW_RATIO_MIN,
  BREW_STEPS_MAX,
  BREW_STEP_AT_SECOND_MIN,
  BREW_STEP_DURATION_SECONDS_MAX,
  BREW_STEP_DURATION_SECONDS_MIN,
  BREW_STEP_LABEL_MAX_LENGTH,
  BREW_STEP_NOTE_MAX_LENGTH,
  BREW_STEP_ORDER_MIN,
  BREW_DURATION_SECONDS_MAX,
  BREW_DURATION_SECONDS_MIN,
  CHAT_MESSAGE_MAX_LENGTH,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  EVENT_NOTE_MAX_LENGTH,
  GRIND_LABEL_MAX_LENGTH,
  GRIND_SETTING_MAX,
  GRIND_SETTING_MIN,
  RECIPE_RATIONALE_MAX_LENGTH,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  WATER_TEMP_C_MAX,
  WATER_TEMP_C_MIN,
  flavorAffinitiesSchema,
  partialTasteAxesSchema,
  type BrewConstraints,
} from '@brewmate/shared';
import { z } from 'zod';

const AT_LEAST_ONE = 1;

/**
 * What the model may claim this cup said about the person who drank it.
 *
 * Partial axes rather than a full profile: one remark about a cup speaks to
 * one or two things, and an answer that filled in all five would be inventing
 * four of them.
 */
const tasteObservationSchema = z.object({
  axes: partialTasteAxesSchema,
  flavorAffinities: flavorAffinitiesSchema.optional(),
  note: z.string().max(EVENT_NOTE_MAX_LENGTH).optional(),
});

export type CoachTasteObservation = z.infer<typeof tasteObservationSchema>;

/**
 * A step, as an adjustment is allowed to rewrite it.
 *
 * `withClock` is false for somebody who told us they have no way to time the
 * brew: their steps end on a sight, and the two time fields are pinned to null
 * rather than merely discouraged.
 */
const clockedStepSchema = z.object({
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

export type CoachStep = z.infer<typeof clockedStepSchema>;

/** The same step with both times pinned shut, for a brew with no clock. */
const sightStepSchema: z.ZodType<CoachStep> = clockedStepSchema.extend({
  atSecond: z.null(),
  durationSeconds: z.null(),
});

const stepSchema = (withClock: boolean): z.ZodType<CoachStep> =>
  withClock ? clockedStepSchema : sightStepSchema;

/**
 * A field somebody has no way to act on may not appear at all.
 *
 * Only an absent key validates - not even an explicit null, which would read
 * as "clear this" and is still a change nobody asked for. A model that
 * proposes it anyway fails validation and the one retry is handed the reason.
 * That is the whole trick: the rule is in the prompt so the model understands
 * it, and in the schema so it holds even when it does not.
 */
const forbidden = (): z.ZodType<undefined> => z.never().optional();

/**
 * The change an answer may propose.
 *
 * Written out rather than inferred, because the schema it describes is built
 * differently for every combination of constraints and there is no single Zod
 * object to infer from. Narrowing a field always stays assignable to the type
 * here - a temperature pinned shut is still an absent temperature - so this
 * stays the one shape every variant produces.
 */
export interface CoachRecipePatch {
  readonly doseGrams?: number;
  readonly waterGrams?: number;
  readonly ratio?: number;
  readonly grindSetting?: number | null;
  readonly grindLabel?: string | null;
  readonly waterTempC?: number | null;
  readonly totalTimeSeconds?: number | null;
  readonly steps?: readonly CoachStep[];
  readonly rationale?: string;
}

export interface CoachAnswer {
  readonly reply: string;
  readonly recipePatch: CoachRecipePatch | null;
  readonly tasteObservation: CoachTasteObservation | null;
}

/**
 * The answer, shaped by what this person was missing.
 *
 * Building the schema from the constraints rather than checking the answer
 * against them afterwards means an impossible suggestion never becomes a
 * message at all - it becomes a retry with the reason attached, which is the
 * same machinery a malformed answer already goes through.
 */
export const resolveCoachAnswerSchema = (constraints: BrewConstraints): z.ZodType<CoachAnswer> => {
  const canSetTemperature = constraints.noTemperatureControl !== true;
  const canGrind = constraints.noGrinder !== true && constraints.fixedGrindSetting !== true;
  const withClock = constraints.noTimer !== true;

  return z.object({
    reply: z.string().min(AT_LEAST_ONE).max(CHAT_MESSAGE_MAX_LENGTH),
    recipePatch: z
      .object({
        doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX).optional(),
        waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX).optional(),
        ratio: z.number().min(BREW_RATIO_MIN).max(BREW_RATIO_MAX).optional(),
        grindSetting: canGrind
          ? z.number().min(GRIND_SETTING_MIN).max(GRIND_SETTING_MAX).nullable().optional()
          : forbidden(),
        grindLabel: canGrind
          ? z.string().max(GRIND_LABEL_MAX_LENGTH).nullable().optional()
          : forbidden(),
        waterTempC: canSetTemperature
          ? z.number().int().min(WATER_TEMP_C_MIN).max(WATER_TEMP_C_MAX).nullable().optional()
          : forbidden(),
        totalTimeSeconds: withClock
          ? z
              .number()
              .int()
              .min(BREW_DURATION_SECONDS_MIN)
              .max(BREW_DURATION_SECONDS_MAX)
              .nullable()
              .optional()
          : forbidden(),
        steps: z.array(stepSchema(withClock)).max(BREW_STEPS_MAX).optional(),
        rationale: z.string().max(RECIPE_RATIONALE_MAX_LENGTH).optional(),
      })
      .nullable(),
    tasteObservation: tasteObservationSchema.nullable(),
  });
};
