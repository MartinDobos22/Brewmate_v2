import { z } from 'zod';

import { GRIND_MICRONS_MAX, GRIND_MICRONS_MIN } from '../grinders/grinderFieldLimits.js';

/**
 * A range of particle sizes.
 *
 * One object rather than two numbers for the same reason a method's ratio
 * window is one: it is never queried, it always travels whole, and two
 * separate figures invite a half-filled range.
 */
export const micronWindowSchema = z
  .object({
    min: z.number().min(GRIND_MICRONS_MIN).max(GRIND_MICRONS_MAX),
    max: z.number().min(GRIND_MICRONS_MIN).max(GRIND_MICRONS_MAX),
  })
  .refine((window: { min: number; max: number }): boolean => window.min <= window.max);

export type MicronWindow = z.infer<typeof micronWindowSchema>;
