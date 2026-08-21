import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';

/** Query string of `GET /recipes`. */
export const recipeQuerySchema = listQuerySchema.extend({
  bagId: z.uuid().optional(),
  methodId: z.uuid().optional(),
  savedOnly: z.stringbool().optional(),
  pinnedOnly: z.stringbool().optional(),
});

export type RecipeQuery = z.infer<typeof recipeQuerySchema>;
