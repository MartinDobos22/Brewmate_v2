import { z } from 'zod';

import { parsedBagDataSchema } from '../bagEvaluations/parsedBagDataSchema.js';

import { coffeeTasteEstimateSchema } from './coffeeTasteEstimateSchema.js';
import {
  COFFEE_SUMMARY_MAX_LENGTH,
  READING_FLAVOUR_NOTES_MAX,
  READING_FLAVOUR_NOTE_MAX_LENGTH,
} from './constants/readingLimits.js';

/**
 * Body of `POST /ai/estimate-coffee-taste`.
 *
 * Only the coffee travels, exactly as it does for the shop verdict. Nothing
 * about the person is sent and nothing about the person is read: this endpoint
 * answers what the coffee tastes like, not whether somebody will like it, and
 * keeping those two apart is what lets the estimate be cached and shared. The
 * same bag tastes the same for everybody; only the verdict is personal.
 */
export const estimateCoffeeTasteRequestSchema = z
  .object({
    parsedData: parsedBagDataSchema,
  })
  .strict();

export type EstimateCoffeeTasteRequest = z.infer<typeof estimateCoffeeTasteRequestSchema>;

/**
 * What the coffee tastes like, and how much of that is guessed.
 *
 * `summary` and `flavourNotes` are null wherever no model was involved - the
 * tables produce a shape and a confidence, and cannot write a sentence. That
 * is a state rather than a degradation: the estimate itself is complete, and
 * the app simply prints one fewer line.
 */
export const estimateCoffeeTasteResponseSchema = z.object({
  estimate: coffeeTasteEstimateSchema,
  summary: z.string().max(COFFEE_SUMMARY_MAX_LENGTH).nullable(),
  flavourNotes: z
    .array(z.string().max(READING_FLAVOUR_NOTE_MAX_LENGTH))
    .max(READING_FLAVOUR_NOTES_MAX),
});

export type EstimateCoffeeTasteResponse = z.infer<typeof estimateCoffeeTasteResponseSchema>;
