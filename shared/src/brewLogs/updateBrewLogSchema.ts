import { z } from 'zod';

import { createBrewLogRequestSchema } from './createBrewLogSchema.js';

/**
 * Body of `PATCH /brew-logs/:id`.
 *
 * The recipe a log belongs to is fixed - editing it would silently move the
 * evidence to a different cup. Correcting the constraints is allowed, and
 * re-prices the learning weight.
 */
export const updateBrewLogRequestSchema = createBrewLogRequestSchema
  .omit({ recipeId: true })
  .partial();

export type UpdateBrewLogRequest = z.infer<typeof updateBrewLogRequestSchema>;
