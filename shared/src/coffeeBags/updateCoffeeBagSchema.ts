import { z } from 'zod';

import { createCoffeeBagRequestSchema } from './createCoffeeBagSchema.js';

/**
 * Body of `PATCH /coffee-bags/:id`.
 *
 * `isArchived` is editable here so a bag can be brought back; `DELETE` is the
 * one-way shortcut for archiving it.
 */
export const updateCoffeeBagRequestSchema = createCoffeeBagRequestSchema
  .partial()
  .extend({ isArchived: z.boolean().optional() });

export type UpdateCoffeeBagRequest = z.infer<typeof updateCoffeeBagRequestSchema>;
