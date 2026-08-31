import { z } from 'zod';

import { MILK_USAGE_LEVELS } from '../enums/milkUsage.js';
import { ROAST_LEVELS } from '../enums/roastLevels.js';

import { flavorAffinitiesSchema } from './flavorAffinitiesSchema.js';
import { sourceWeightsSchema } from './sourceWeightsSchema.js';
import { tasteAxisConfidenceSchema } from './tasteAxisConfidenceSchema.js';
import { tasteAxesSchema } from './tasteAxesSchema.js';
import { BREW_COUNT_MIN, CONFIDENCE_MAX, CONFIDENCE_MIN } from './tasteProfileFieldLimits.js';

/**
 * What Brewmate believes about one person's taste.
 *
 * There is no `id`: the profile is a singleton per account, so `userId` is the
 * primary key and two profiles for one user are physically impossible.
 *
 * The row is a projection - `taste_profile_events` is the truth, and replaying
 * them reproduces exactly this.
 */
export const tasteProfileSchema = tasteAxesSchema.extend({
  userId: z.uuid(),
  flavorAffinities: flavorAffinitiesSchema,
  /** Reuses the roast levels; `null` means no preference. */
  roastPreference: z.enum(ROAST_LEVELS).nullable(),
  milkUsage: z.enum(MILK_USAGE_LEVELS).nullable(),
  sourceWeights: sourceWeightsSchema,
  /**
   * How much of each axis has actually been earned.
   *
   * `confidenceLevel` below answers "how well do you know me"; this answers
   * "which parts of this do you actually know", and the two are not the same
   * question. An account is routinely well understood on the one axis it keeps
   * complaining about and blank on the other four.
   */
  axisConfidence: tasteAxisConfidenceSchema,
  confidenceLevel: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  brewCount: z.number().int().min(BREW_COUNT_MIN),
  updatedAt: z.iso.datetime(),
});

export type TasteProfile = z.infer<typeof tasteProfileSchema>;
