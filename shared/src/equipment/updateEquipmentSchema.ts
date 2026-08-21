import { z } from 'zod';

import { createEquipmentRequestSchema } from './createEquipmentSchema.js';

/**
 * Body of `PATCH /equipment/:id`.
 *
 * `type` is not editable: a grinder does not become a kettle, and the sets
 * and recipes pointing at it assume it did not.
 */
export const updateEquipmentRequestSchema = createEquipmentRequestSchema.omit({ type: true });

export type UpdateEquipmentRequest = z.infer<typeof updateEquipmentRequestSchema>;
