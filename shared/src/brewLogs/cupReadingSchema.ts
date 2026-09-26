import { z } from 'zod';

import { CUP_EXTRACTION_VALUES } from '../enums/cupExtractions.js';
import { CUP_STRENGTH_VALUES } from '../enums/cupStrengths.js';

/**
 * What was said about one cup, in the terms a brew can be corrected in.
 *
 * Each half is null until somebody spoke to it: "bola kyslá" says nothing
 * about strength, and filling that in as `right` would be the app hearing a
 * compliment nobody paid.
 */
export const cupReadingSchema = z.object({
  extraction: z.enum(CUP_EXTRACTION_VALUES).nullable(),
  strength: z.enum(CUP_STRENGTH_VALUES).nullable(),
});

export type CupReading = z.infer<typeof cupReadingSchema>;
