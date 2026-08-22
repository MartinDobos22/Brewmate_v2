import { z } from 'zod';

import { TASTE_AXIS_MAX, TASTE_AXIS_MIN } from './tasteProfileFieldLimits.js';

const axis = (): z.ZodNumber => z.number().min(TASTE_AXIS_MIN).max(TASTE_AXIS_MAX);

/**
 * The five axes a cup is described on. Real columns rather than `jsonb`:
 * they are the thing the profile *is*, they are sorted and compared, and
 * their number is fixed by the product, not by the data.
 */
export const tasteAxesSchema = z.object({
  acidity: axis(),
  sweetness: axis(),
  body: axis(),
  bitterness: axis(),
  intensity: axis(),
});

export type TasteAxes = z.infer<typeof tasteAxesSchema>;

/** A partial observation: an event usually speaks about one or two axes. */
export const partialTasteAxesSchema = tasteAxesSchema.partial();

export type PartialTasteAxes = z.infer<typeof partialTasteAxesSchema>;
