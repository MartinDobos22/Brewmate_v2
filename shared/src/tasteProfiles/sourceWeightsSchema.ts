import { z } from 'zod';

import { TASTE_PROFILE_SOURCES } from '../enums/tasteProfileSources.js';

import { CONFIDENCE_MAX, CONFIDENCE_MIN } from './tasteProfileFieldLimits.js';

/**
 * How much each kind of evidence contributed to the current profile.
 * Written by the reducer, so a recompute can be inspected rather than trusted.
 */
export const sourceWeightsSchema = z.partialRecord(
  z.enum(TASTE_PROFILE_SOURCES),
  z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
);

export type SourceWeights = z.infer<typeof sourceWeightsSchema>;
