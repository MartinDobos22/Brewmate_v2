import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';

/** Query string of `GET /bag-ratings`: every rating, or one bag's. */
export const bagRatingQuerySchema = listQuerySchema.extend({
  bagId: z.uuid().optional(),
});

export type BagRatingQuery = z.infer<typeof bagRatingQuerySchema>;

/** The same filter as the app supplies it, before the API applies its defaults. */
export type BagRatingFilter = Partial<BagRatingQuery>;
