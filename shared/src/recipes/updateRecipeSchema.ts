import { z } from 'zod';

import { createRecipeRequestSchema } from './createRecipeSchema.js';

/**
 * Body of `PATCH /recipes/:id`.
 *
 * Setting `isPinned` unpins whatever else was pinned for the same
 * (bag, method) pair, in one transaction - the partial unique index in the
 * database is the backstop, not the mechanism.
 */
export const updateRecipeRequestSchema = createRecipeRequestSchema.partial();

export type UpdateRecipeRequest = z.infer<typeof updateRecipeRequestSchema>;
