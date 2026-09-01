import { z } from 'zod';

import { MILK_USAGE_LEVELS } from '../enums/milkUsage.js';
import { ROAST_LEVELS } from '../enums/roastLevels.js';

import { flavorAffinitiesSchema } from './flavorAffinitiesSchema.js';
import { partialTasteAxesConfidenceSchema } from './tasteAxisConfidenceSchema.js';
import { partialTasteAxesSchema } from './tasteAxesSchema.js';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  EVENT_NOTE_MAX_LENGTH,
} from './tasteProfileFieldLimits.js';

/**
 * The raw observation, exactly as it arrived. Kept verbatim so a replay starts
 * from the input rather than from a conclusion drawn about it.
 */
export const tasteProfileEventPayloadSchema = z.object({
  axes: partialTasteAxesSchema,
  /**
   * How firmly this observation speaks about each axis it names, 0..1.
   *
   * Separate from `weight` because one observation is rarely equally sure of
   * everything it says. A questionnaire that asked five questions touching
   * acidity and got five compatible answers knows that axis far better than
   * the one it inferred from a single remark about chocolate - and if those
   * five answers had contradicted each other, it knows it less well than
   * either. An axis left out is taken as fully weighted, so an observation
   * that has no opinion about the difference simply says nothing.
   */
  axisWeights: partialTasteAxesConfidenceSchema.optional(),
  flavorAffinities: flavorAffinitiesSchema.optional(),
  roastPreference: z.enum(ROAST_LEVELS).nullable().optional(),
  milkUsage: z.enum(MILK_USAGE_LEVELS).nullable().optional(),
  /** How much this observation should count, before the source is weighed in. */
  weight: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX).optional(),
  note: z.string().max(EVENT_NOTE_MAX_LENGTH).optional(),
});

export type TasteProfileEventPayload = z.infer<typeof tasteProfileEventPayloadSchema>;
