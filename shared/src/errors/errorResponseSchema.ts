import { z } from 'zod';

import { ERROR_CODES } from './errorCodes.js';

/**
 * Every non-2xx response from the API has exactly this shape.
 */
export const errorResponseSchema = z.object({
  error: z.object({
    code: z.enum(ERROR_CODES),
    message: z.string(),
    details: z.unknown().nullable(),
  }),
  requestId: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
