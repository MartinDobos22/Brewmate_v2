import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';
import { BREW_METHOD_CATEGORIES } from '../enums/brewMethodCategories.js';

/** Query string of `GET /brew-methods`. Retired methods are hidden by default. */
export const brewMethodQuerySchema = listQuerySchema.extend({
  category: z.enum(BREW_METHOD_CATEGORIES).optional(),
  includeInactive: z.stringbool().optional(),
});

export type BrewMethodQuery = z.infer<typeof brewMethodQuerySchema>;

/** The same filter as the app supplies it, before the API applies its defaults. */
export type BrewMethodFilter = Partial<BrewMethodQuery>;
