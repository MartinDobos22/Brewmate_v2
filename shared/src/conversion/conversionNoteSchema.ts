import { z } from 'zod';

import { CONVERSION_FIELD_NAMES } from './conversionFields.js';
import { CONVERSION_PRECISIONS } from './conversionPrecision.js';
import { CONVERSION_REASONS } from './conversionReasons.js';

/**
 * One thing the conversion has to admit about one number.
 *
 * Three machine names and no prose. The field says where to print it, the
 * precision says how much the number is worth, and the reason says why - and
 * whoever draws the screen turns that into a Slovak sentence.
 *
 * That division is the whole design. A conversion that wrote its own
 * disclaimers would be a conversion whose honesty depends on a model's mood,
 * and the one thing this feature has to be is honest about which of its
 * numbers is arithmetic and which is a guess.
 */
export const conversionNoteSchema = z.object({
  field: z.enum(CONVERSION_FIELD_NAMES),
  precision: z.enum(CONVERSION_PRECISIONS),
  reason: z.enum(CONVERSION_REASONS),
});

export type ConversionNote = z.infer<typeof conversionNoteSchema>;
