import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';

/** Query string of `GET /brew-logs`. */
export const brewLogQuerySchema = listQuerySchema.extend({
  bagId: z.uuid().optional(),
  recipeId: z.uuid().optional(),
  equipmentSetId: z.uuid().optional(),
});

export type BrewLogQuery = z.infer<typeof brewLogQuerySchema>;

/** The same filter as the app supplies it, before the API applies its defaults. */
export type BrewLogFilter = Partial<BrewLogQuery>;
