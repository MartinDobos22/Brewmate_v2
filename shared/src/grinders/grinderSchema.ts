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
 * A grinder in the shared catalogue.
 *
 * Users may contribute entries, so the catalogue is not user-scoped but the
 * *visibility* is: an unverified entry is only offered to the person who added
 * it, otherwise one typo would end up in everybody's picker.
 *
 * `createdByUserId` is nulled rather than cascaded when that person deletes
 * their account - the entry is shared data other people's equipment points at,
 * and only the attribution is personal.
 */
export const grinderSchema = z.object({
  id: z.uuid(),
  brand: z.string().min(1).max(GRINDER_BRAND_MAX_LENGTH),
  model: z.string().min(1).max(GRINDER_MODEL_MAX_LENGTH),
  unitType: z.enum(GRINDER_UNIT_TYPES),
  minSetting: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
  maxSetting: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
  step: z.number().min(GRINDER_STEP_MIN),
  micronCalibration: micronCalibrationSchema.nullable(),
  typicalUse: z.enum(GRINDER_TYPICAL_USES),
  isVerified: z.boolean(),
  createdByUserId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
});

export type Grinder = z.infer<typeof grinderSchema>;
