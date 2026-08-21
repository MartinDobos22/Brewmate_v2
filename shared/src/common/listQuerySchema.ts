import { z } from 'zod';

import {
  LIST_LIMIT_DEFAULT,
  LIST_LIMIT_MAX,
  LIST_LIMIT_MIN,
  LIST_OFFSET_DEFAULT,
  LIST_OFFSET_MIN,
} from './paginationLimits.js';

/**
 * Query string accepted by every list endpoint. Coerced because a query string
 * only ever carries text.
 */
export const listQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(LIST_LIMIT_MIN)
    .max(LIST_LIMIT_MAX)
    .default(LIST_LIMIT_DEFAULT),
  offset: z.coerce.number().int().min(LIST_OFFSET_MIN).default(LIST_OFFSET_DEFAULT),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

/**
 * The same filter as the app supplies it: everything optional, because the
 * defaults are the API's to apply.
 */
export type ListFilter = Partial<ListQuery>;
