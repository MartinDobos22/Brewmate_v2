import { z } from 'zod';

import { bagEvaluationSchema } from '../bagEvaluations/bagEvaluationSchema.js';
import { parsedBagDataSchema } from '../bagEvaluations/parsedBagDataSchema.js';
import { IMAGE_URL_MAX_LENGTH } from '../coffeeBags/coffeeBagFieldLimits.js';

/**
 * Body of `POST /ai/evaluate-coffee`.
 *
 * Only the coffee is sent. The taste profile, its confidence, the brew count
 * and the history of everything this account has already been advised about
 * are read by the server off the caller's own rows - a profile a client could
 * declare would be a profile anybody could declare, and the whole point of the
 * verdict is that it is about this person.
 */
export const evaluateCoffeeRequestSchema = z
  .object({
    parsedData: parsedBagDataSchema,
    imageUrl: z.url().max(IMAGE_URL_MAX_LENGTH).nullable().optional(),
  })
  .strict();

export type EvaluateCoffeeRequest = z.infer<typeof evaluateCoffeeRequestSchema>;

/**
 * The verdict, and whether it was written today.
 *
 * `fromHistory` marks a coffee this account has already been advised about.
 * The stored verdict is returned rather than a new one being written: advice
 * that comes out differently every time it is asked for is advice nobody can
 * rely on, and the screen says which afternoon it was given.
 */
export const evaluateCoffeeResponseSchema = z.object({
  evaluation: bagEvaluationSchema,
  fromHistory: z.boolean(),
});

export type EvaluateCoffeeResponse = z.infer<typeof evaluateCoffeeResponseSchema>;
