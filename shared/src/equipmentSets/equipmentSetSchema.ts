import { z } from 'zod';

import { brewConstraintsSchema } from '../brewing/brewConstraintsSchema.js';

import {
  EQUIPMENT_SET_ITEMS_MAX,
  EQUIPMENT_SET_NAME_MAX_LENGTH,
  EQUIPMENT_SET_NAME_MIN_LENGTH,
  EQUIPMENT_SET_SORT_ORDER_MIN,
} from './equipmentSetFieldLimits.js';

/**
 * A named combination of gear the user already owns - "Domov", "Chata",
 * "Praca". It introduces no new equipment; it is a saved selection.
 *
 * `equipmentIds` is a `jsonb` array rather than a join table: the set is
 * always read whole, its order carries meaning and replacing it is one write.
 * The price is that the database cannot enforce the reference, so the service
 * does it instead - every id must exist *and* belong to the caller, and
 * deleting a piece of gear prunes it out of that user's sets.
 *
 * `defaultConstraints` is what this place is usually missing, so a brew logged
 * at the cabin starts out honest about it.
 */
export const equipmentSetSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z.string().min(EQUIPMENT_SET_NAME_MIN_LENGTH).max(EQUIPMENT_SET_NAME_MAX_LENGTH),
  equipmentIds: z.array(z.uuid()).max(EQUIPMENT_SET_ITEMS_MAX),
  defaultConstraints: brewConstraintsSchema,
  isDefault: z.boolean(),
  sortOrder: z.number().int().min(EQUIPMENT_SET_SORT_ORDER_MIN),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type EquipmentSet = z.infer<typeof equipmentSetSchema>;
