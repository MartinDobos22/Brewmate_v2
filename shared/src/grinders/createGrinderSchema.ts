import { z } from 'zod';

import { GRINDER_TYPICAL_USES } from '../enums/grinderTypicalUse.js';
import { GRINDER_UNIT_TYPES } from '../enums/grinderUnitTypes.js';

import {
  GRINDER_BRAND_MAX_LENGTH,
  GRINDER_MODEL_MAX_LENGTH,
  GRINDER_SETTING_MAX,
  GRINDER_SETTING_MIN,
  GRINDER_STEP_MIN,
} from './grinderFieldLimits.js';
import { micronCalibrationSchema } from './micronCalibrationSchema.js';

/**
 * Body of `POST /grinders`.
 *
 * `isVerified` is deliberately not accepted: a client cannot promote its own
 * contribution into everybody else's catalogue.
 */
export const createGrinderRequestSchema = z
  .object({
    brand: z.string().min(1).max(GRINDER_BRAND_MAX_LENGTH),
    model: z.string().min(1).max(GRINDER_MODEL_MAX_LENGTH),
    unitType: z.enum(GRINDER_UNIT_TYPES),
    minSetting: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
    maxSetting: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
    step: z.number().min(GRINDER_STEP_MIN),
    micronCalibration: micronCalibrationSchema.nullable().optional(),
    typicalUse: z.enum(GRINDER_TYPICAL_USES),
  })
  .strict()
  .refine(
    (input: { minSetting: number; maxSetting: number }): boolean =>
      input.minSetting <= input.maxSetting,
  );

export type CreateGrinderRequest = z.infer<typeof createGrinderRequestSchema>;
