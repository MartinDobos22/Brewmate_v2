import { z } from 'zod';

import { jsonObjectSchema } from '../common/jsonValueSchema.js';
import { EQUIPMENT_TYPES } from '../enums/equipmentTypes.js';

import { EQUIPMENT_BRAND_MAX_LENGTH, EQUIPMENT_MODEL_MAX_LENGTH } from './equipmentFieldLimits.js';

/** Body of `POST /equipment`. The owner comes from the token, never the body. */
export const createEquipmentRequestSchema = z
  .object({
    type: z.enum(EQUIPMENT_TYPES),
    catalogGrinderId: z.uuid().nullable().optional(),
    brand: z.string().max(EQUIPMENT_BRAND_MAX_LENGTH).nullable().optional(),
    model: z.string().max(EQUIPMENT_MODEL_MAX_LENGTH).nullable().optional(),
    params: jsonObjectSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type CreateEquipmentRequest = z.infer<typeof createEquipmentRequestSchema>;
