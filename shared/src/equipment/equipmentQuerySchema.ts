import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';
import { EQUIPMENT_TYPES } from '../enums/equipmentTypes.js';

/** Query string of `GET /equipment`. */
export const equipmentQuerySchema = listQuerySchema.extend({
  type: z.enum(EQUIPMENT_TYPES).optional(),
  activeOnly: z.stringbool().optional(),
});

export type EquipmentQuery = z.infer<typeof equipmentQuerySchema>;
