import { z } from 'zod';

import { createEquipmentSetRequestSchema } from './createEquipmentSetSchema.js';

/** Body of `PATCH /equipment-sets/:id`. */
export const updateEquipmentSetRequestSchema = createEquipmentSetRequestSchema.partial();

export type UpdateEquipmentSetRequest = z.infer<typeof updateEquipmentSetRequestSchema>;
