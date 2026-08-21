import { z } from 'zod';

import { coffeeBagSchema } from './coffeeBagSchema.js';

/**
 * Body of `POST /coffee-bags`.
 *
 * Identity, ownership and lifecycle are the server's to decide, so they are
 * not part of the body at all.
 */
export const createCoffeeBagRequestSchema = coffeeBagSchema
  .omit({
    id: true,
    userId: true,
    isArchived: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .required({ name: true })
  .strict();

export type CreateCoffeeBagRequest = z.infer<typeof createCoffeeBagRequestSchema>;
