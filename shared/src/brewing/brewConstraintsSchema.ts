import { z } from 'zod';

import { CONSTRAINT_LABEL_MAX_LENGTH, CONSTRAINTS_OTHER_MAX } from './brewingFieldLimits.js';

/**
 * What the brewer could not do this time.
 *
 * This is what keeps a weekend at a cabin from rewriting somebody's taste
 * profile: a cup that disappointed because there was no temperature control
 * says nothing about what that person likes, and the API turns these flags
 * into a lower `profileLearningWeight` on the brew log.
 *
 * Named flags rather than free text, because the reducer has to price them.
 */
export const brewConstraintsSchema = z.object({
  noTemperatureControl: z.boolean().optional(),
  noScale: z.boolean().optional(),
  noGrinder: z.boolean().optional(),
  fixedGrindSetting: z.boolean().optional(),
  borrowedEquipment: z.boolean().optional(),
  unknownWater: z.boolean().optional(),
  limitedTime: z.boolean().optional(),
  /** Anything the vocabulary above does not cover yet. */
  other: z.array(z.string().max(CONSTRAINT_LABEL_MAX_LENGTH)).max(CONSTRAINTS_OTHER_MAX).optional(),
});

export type BrewConstraints = z.infer<typeof brewConstraintsSchema>;
