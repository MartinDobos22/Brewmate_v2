import { z } from 'zod';

import { GRIND_MICRONS_MAX, GRIND_MICRONS_MIN } from '../grinders/grinderFieldLimits.js';

import { CONVERSION_NOTES_MAX } from './conversionFieldLimits.js';
import { conversionNoteSchema } from './conversionNoteSchema.js';
import { GRIND_DESCRIPTORS } from './grindDescriptors.js';
import { sourceRecipeSchema } from './sourceRecipeSchema.js';

/**
 * What a converted recipe remembers about where it came from.
 *
 * Stored on the recipe rather than returned once beside it, for the same
 * reason the constraint hints are: these are not a footnote to one response,
 * they are the difference between a grind number that is a measurement and one
 * that is a starting point. A recipe reopened next month has to still say
 * which of its numbers were guesses, or the app will have quietly turned an
 * estimate into a fact by doing nothing at all.
 *
 * The source recipe is kept whole. It costs a few hundred bytes and it is the
 * only way to answer "but what did the original actually say?", which is the
 * first thing anybody asks when a converted recipe disappoints them.
 */
export const conversionReportSchema = z.object({
  source: sourceRecipeSchema,
  notes: z.array(conversionNoteSchema).max(CONVERSION_NOTES_MAX),
  grindMicrons: z.number().min(GRIND_MICRONS_MIN).max(GRIND_MICRONS_MAX).nullable(),
  grindDescriptor: z.enum(GRIND_DESCRIPTORS).nullable(),
});

export type ConversionReport = z.infer<typeof conversionReportSchema>;
