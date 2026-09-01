import { z } from 'zod';

import { tasteAxesSchema } from '../tasteProfiles/tasteAxesSchema.js';
import { tasteAxisConfidenceSchema } from '../tasteProfiles/tasteAxisConfidenceSchema.js';

import {
  COFFEE_ESTIMATE_SOURCE_VALUES,
  COFFEE_SIGNAL_SOURCE_VALUES,
} from './coffeeSignalSources.js';

/**
 * What a coffee probably tastes like.
 *
 * The same five axes and the same per-axis confidence the drinker is described
 * on, because the entire purpose of this is to be held up against a taste
 * profile - and two things can only be compared if they were measured the same
 * way. A schema that described a coffee in its own vocabulary would push the
 * translation into whichever screen did the comparing, which is where it would
 * quietly go wrong.
 *
 * `signals` is what the estimate actually rests on, in machine names the app
 * translates. It is not decoration: an estimate drawn from a country alone and
 * one drawn from a full label look identical once they are five numbers, and
 * the difference between them is the difference between a guess and a reading.
 */
export const coffeeTasteEstimateSchema = z.object({
  axes: tasteAxesSchema,
  axisConfidence: tasteAxisConfidenceSchema,
  signals: z.array(z.enum(COFFEE_SIGNAL_SOURCE_VALUES)),
  source: z.enum(COFFEE_ESTIMATE_SOURCE_VALUES),
});

export type CoffeeTasteEstimate = z.infer<typeof coffeeTasteEstimateSchema>;
