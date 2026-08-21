import { z } from 'zod';

import { BREW_METHOD_RATIO_MAX, BREW_METHOD_RATIO_MIN } from './brewMethodFieldLimits.js';

/**
 * The sensible coffee-to-water window for a method.
 *
 * One `jsonb` value rather than two columns: it is never queried, it always
 * travels whole, and two nullable columns invite a half-filled range.
 */
export const ratioRangeSchema = z
  .object({
    min: z.number().min(BREW_METHOD_RATIO_MIN).max(BREW_METHOD_RATIO_MAX),
    max: z.number().min(BREW_METHOD_RATIO_MIN).max(BREW_METHOD_RATIO_MAX),
  })
  .refine((range: { min: number; max: number }): boolean => range.min <= range.max);

export type RatioRange = z.infer<typeof ratioRangeSchema>;
