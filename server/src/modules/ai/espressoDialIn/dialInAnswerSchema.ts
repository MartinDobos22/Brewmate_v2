import {
  CHAT_MESSAGE_MAX_LENGTH,
  DIAL_IN_CHANGES,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  EVENT_NOTE_MAX_LENGTH,
  GRIND_LABEL_MAX_LENGTH,
  GRIND_SETTING_MAX,
  GRIND_SETTING_MIN,
  RECIPE_RATIONALE_MAX_LENGTH,
  flavorAffinitiesSchema,
  partialTasteAxesSchema,
  type BrewConstraints,
  type DialInChange,
} from '@brewmate/shared';
import { z } from 'zod';

const AT_LEAST_ONE = 1;

/**
 * What a shot said about the person who drank it.
 *
 * The same shape the recipe coach uses, and for the same reason: partial axes,
 * because one remark about one espresso speaks to one or two things, and an
 * answer that filled in all five would be inventing four of them.
 */
const tasteObservationSchema = z.object({
  axes: partialTasteAxesSchema,
  flavorAffinities: flavorAffinitiesSchema.optional(),
  note: z.string().max(EVENT_NOTE_MAX_LENGTH).optional(),
});

export type DialInTasteObservation = z.infer<typeof tasteObservationSchema>;

/**
 * A field this answer is not allowed to touch.
 *
 * Only an absent key validates - not even an explicit null. This is what makes
 * "one change at a time" a guarantee rather than a request.
 */
const forbidden = (): z.ZodType<undefined> => z.never().optional();

/**
 * One dial-in answer: what to change, by how much, and why.
 *
 * `change` names which single variable moves, and the schema then opens
 * exactly the field that variable lives in. `none` opens neither, which is a
 * real and important answer - the shot was good, or the last change has not
 * had a fair try, and grinding again for the sake of movement is how a bag
 * gets spent on a dial-in that was already finished.
 */
export interface DialInAnswer {
  readonly reply: string;
  readonly change: DialInChange;
  readonly grindSetting?: number;
  readonly grindLabel?: string | null;
  readonly doseGrams?: number;
  readonly rationale?: string;
  readonly tasteObservation: DialInTasteObservation | null;
}

const commonFields = {
  reply: z.string().min(AT_LEAST_ONE).max(CHAT_MESSAGE_MAX_LENGTH),
  rationale: z.string().max(RECIPE_RATIONALE_MAX_LENGTH).optional(),
  tasteObservation: tasteObservationSchema.nullable(),
};

/**
 * The answer's shape, built so that only one variable can move.
 *
 * A discriminated union rather than one object with three optional fields:
 * three optionals would let an answer set the grind *and* the dose, and the
 * service would then have to refuse it after the fact - which means writing
 * the refusal into a message somebody reads as the app not listening. As a
 * union, an answer that moves both is a validation failure the single retry is
 * handed the reason for, before it ever becomes a sentence.
 *
 * This is the rule the whole mode is built on. Two variables moved at once
 * produce a shot nobody can read: it came out different, and there is no way
 * to say which change did it. The goal is a drinkable espresso in as few shots
 * as possible, and the fastest way to waste four of them is to change two
 * things each time.
 */
export const resolveDialInAnswerSchema = (
  constraints: BrewConstraints,
): z.ZodType<DialInAnswer> => {
  const canGrind = constraints.noGrinder !== true && constraints.fixedGrindSetting !== true;

  const grindAnswer = z.object({
    ...commonFields,
    change: z.literal(DIAL_IN_CHANGES.grind),
    grindSetting: z.number().min(GRIND_SETTING_MIN).max(GRIND_SETTING_MAX),
    grindLabel: z.string().max(GRIND_LABEL_MAX_LENGTH).nullable().optional(),
    doseGrams: forbidden(),
  });

  const doseAnswer = z.object({
    ...commonFields,
    change: z.literal(DIAL_IN_CHANGES.dose),
    doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX),
    grindSetting: forbidden(),
    grindLabel: forbidden(),
  });

  const noChangeAnswer = z.object({
    ...commonFields,
    change: z.literal(DIAL_IN_CHANGES.none),
    grindSetting: forbidden(),
    grindLabel: forbidden(),
    doseGrams: forbidden(),
  });

  /**
   * Somebody grinding pre-ground coffee, or on a grinder that is set and
   * staying that way, cannot be told to grind finer. The option is removed
   * rather than discouraged - an impossible suggestion is a message telling
   * somebody the app was not listening.
   */
  return canGrind
    ? z.discriminatedUnion('change', [grindAnswer, doseAnswer, noChangeAnswer])
    : z.discriminatedUnion('change', [doseAnswer, noChangeAnswer]);
};
