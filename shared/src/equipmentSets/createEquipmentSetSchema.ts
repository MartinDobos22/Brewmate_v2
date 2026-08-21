import { z } from 'zod';

import { brewConstraintsSchema } from '../brewing/brewConstraintsSchema.js';

import {
  EQUIPMENT_SET_ITEMS_MAX,
  EQUIPMENT_SET_NAME_MAX_LENGTH,
  EQUIPMENT_SET_NAME_MIN_LENGTH,
  EQUIPMENT_SET_SORT_ORDER_MIN,
} from './equipmentSetFieldLimits.js';

/** Body of `POST /equipment-sets`. */
export const createEquipmentSetRequestSchema = z
  .object({
    name: z.string().min(EQUIPMENT_SET_NAME_MIN_LENGTH).max(EQUIPMENT_SET_NAME_MAX_LENGTH),
    equipmentIds: z.array(z.uuid()).max(EQUIPMENT_SET_ITEMS_MAX),
    defaultConstraints: brewConstraintsSchema.optional(),
    isDefault: z.boolean().optional(),
    sortOrder: z.number().int().min(EQUIPMENT_SET_SORT_ORDER_MIN).optional(),
  })
  .strict();

export type CreateEquipmentSetRequest = z.infer<typeof createEquipmentSetRequestSchema>;
