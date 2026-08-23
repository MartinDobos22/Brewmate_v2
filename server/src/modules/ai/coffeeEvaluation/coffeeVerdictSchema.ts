import {
  REASONING_POINTS_MAX,
  REASONING_POINT_MAX_LENGTH,
  UNCERTAINTIES_MAX,
  UNCERTAINTY_FIELD_MAX_LENGTH,
  UNCERTAINTY_REASON_MAX_LENGTH,
  VERDICT_TEXT_MAX_LENGTH,
} from '@brewmate/shared';
import { z } from 'zod';

const AT_LEAST_ONE_REASON = 1;

/**
 * The shape the verdict has to come back in.
 *
 * `reasoning` has a minimum of one for the same reason the product rule says
 * every verdict is argued: an opinion with nothing behind it is a score, and a
 * score is exactly what this screen refuses to give. Even the honest "I cannot
 * judge this" answer has a reason - it is that nothing is known yet.
 *
 * The bounds are the ones a stored evaluation already obeys, so an answer that
 * validates here is an answer that fits in the database.
 */
export const coffeeVerdictSchema = z.object({
  verdictText: z.string().min(AT_LEAST_ONE_REASON).max(VERDICT_TEXT_MAX_LENGTH),
  reasoning: z
    .array(z.string().min(AT_LEAST_ONE_REASON).max(REASONING_POINT_MAX_LENGTH))
    .min(AT_LEAST_ONE_REASON)
    .max(REASONING_POINTS_MAX),
  uncertainties: z
    .array(
      z.object({
        field: z.string().max(UNCERTAINTY_FIELD_MAX_LENGTH),
        reason: z.string().max(UNCERTAINTY_REASON_MAX_LENGTH),
      }),
    )
    .max(UNCERTAINTIES_MAX),
});

export type CoffeeVerdict = z.infer<typeof coffeeVerdictSchema>;
