import { z } from 'zod';

import { DEPENDENCY_STATUS, HEALTH_STATUS } from './healthStatus.js';

export const healthResponseSchema = z.object({
  status: z.enum(HEALTH_STATUS),
  uptimeSeconds: z.number().nonnegative(),
  checkedAt: z.iso.datetime(),
  dependencies: z.object({
    database: z.enum(DEPENDENCY_STATUS),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
