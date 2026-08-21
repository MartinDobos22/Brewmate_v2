import { z } from 'zod';

import { listQuerySchema } from '../common/listQuerySchema.js';
import { GRINDER_TYPICAL_USES } from '../enums/grinderTypicalUse.js';

/** Query string of `GET /grinders`. */
export const grinderQuerySchema = listQuerySchema.extend({
  typicalUse: z.enum(GRINDER_TYPICAL_USES).optional(),
  /** Hides the caller's own unverified contributions. */
  verifiedOnly: z.stringbool().optional(),
});

export type GrinderQuery = z.infer<typeof grinderQuerySchema>;
