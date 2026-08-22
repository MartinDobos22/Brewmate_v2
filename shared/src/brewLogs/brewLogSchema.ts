import { z } from 'zod';

import { brewConstraintsSchema } from '../brewing/brewConstraintsSchema.js';
import {
  BREW_DURATION_SECONDS_MAX,
  BREW_DURATION_SECONDS_MIN,
} from '../brewing/brewingFieldLimits.js';
import { partialBrewParamsSchema } from '../brewing/brewParamsSchema.js';
import { WATER_TYPES } from '../enums/waterTypes.js';
import { CONFIDENCE_MAX, CONFIDENCE_MIN } from '../tasteProfiles/tasteProfileFieldLimits.js';

/**
 * A cup that was actually brewed.
 *
 * Everything here is a historical record and none of it is derived at read
 * time. `constraints` is what was true that morning, `waterType` is the water
 * that went in, `actualParams` is what happened rather than what was planned.
 *
 * `profileLearningWeight` is computed once, on the way in, from those
 * constraints - and that is the whole point. If it were derived on read, the
 * day someone finally buys a kettle with temperature control, every
 * disappointing cup they ever brewed at a cabin would retroactively start
 * counting as evidence about their taste.
 */
export const brewLogSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  recipeId: z.uuid(),
  /** Null when the recipe was a quick brew with beans outside the inventory. */
  bagId: z.uuid().nullable(),
  equipmentSetId: z.uuid().nullable(),
  constraints: brewConstraintsSchema,
  actualParams: partialBrewParamsSchema,
  waterType: z.enum(WATER_TYPES),
  durationSeconds: z
    .number()
    .int()
    .min(BREW_DURATION_SECONDS_MIN)
    .max(BREW_DURATION_SECONDS_MAX)
    .nullable(),
  profileLearningWeight: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  createdAt: z.iso.datetime(),
});

export type BrewLog = z.infer<typeof brewLogSchema>;
