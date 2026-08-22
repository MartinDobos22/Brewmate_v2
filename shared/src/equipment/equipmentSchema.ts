import { z } from 'zod';

import { jsonObjectSchema } from '../common/jsonValueSchema.js';
import { EQUIPMENT_TYPES } from '../enums/equipmentTypes.js';

import { EQUIPMENT_BRAND_MAX_LENGTH, EQUIPMENT_MODEL_MAX_LENGTH } from './equipmentFieldLimits.js';

/**
 * One piece of gear someone owns.
 *
 * `catalogGrinderId` links a grinder to the shared catalogue, which is what
 * makes its settings translatable into microns. Gear bought second hand and
 * never catalogued still works - the link is nullable.
 *
 * `params` is `jsonb` because a kettle and a scale have nothing in common; a
 * column per property would be a table full of nulls.
 */
export const equipmentSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  type: z.enum(EQUIPMENT_TYPES),
  catalogGrinderId: z.uuid().nullable(),
  brand: z.string().max(EQUIPMENT_BRAND_MAX_LENGTH).nullable(),
  model: z.string().max(EQUIPMENT_MODEL_MAX_LENGTH).nullable(),
  params: jsonObjectSchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Equipment = z.infer<typeof equipmentSchema>;
