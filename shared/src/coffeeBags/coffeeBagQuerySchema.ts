import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';

/** Query string of `GET /coffee-bags`. Archived bags are hidden by default. */
export const coffeeBagQuerySchema = listQuerySchema.extend({
  includeArchived: z.stringbool().optional(),
});

export type CoffeeBagQuery = z.infer<typeof coffeeBagQuerySchema>;
