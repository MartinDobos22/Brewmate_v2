import { z } from 'zod';

import { flavorAffinitiesSchema } from './flavorAffinitiesSchema.js';
import { partialTasteAxesSchema } from './tasteAxesSchema.js';
import { CONFIDENCE_MAX, CONFIDENCE_MIN } from './tasteProfileFieldLimits.js';

/**
 * What the reducer actually did with one event.
 *
 * Stored next to the event so a replay can be compared with what happened at
 * the time, instead of being taken on faith.
 */
export const tasteProfileDeltaSchema = z.object({
  axes: partialTasteAxesSchema,
  flavorAffinities: flavorAffinitiesSchema,
  /** The share of the new observation that was blended into the profile. */
  weight: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
});

export type TasteProfileDelta = z.infer<typeof tasteProfileDeltaSchema>;
