import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';
import { GRINDER_TYPICAL_USES } from '../enums/grinderTypicalUse.js';

import { GRINDER_SEARCH_MAX_LENGTH, GRINDER_SEARCH_MIN_LENGTH } from './grinderFieldLimits.js';

/** Query string of `GET /grinders`. */
export const grinderQuerySchema = listQuerySchema.extend({
  typicalUse: z.enum(GRINDER_TYPICAL_USES).optional(),
  /** Hides the caller's own unverified contributions. */
  verifiedOnly: z.stringbool().optional(),
  /**
   * Free text matched against the brand and the model together, so "1zpresso
   * jx" and "jx pro" both find the same row.
   */
  search: z
    .string()
    .trim()
    .min(GRINDER_SEARCH_MIN_LENGTH)
    .max(GRINDER_SEARCH_MAX_LENGTH)
    .optional(),
});

export type GrinderQuery = z.infer<typeof grinderQuerySchema>;

/** The same filter as the app supplies it, before the API applies its defaults. */
export type GrinderFilter = Partial<GrinderQuery>;
