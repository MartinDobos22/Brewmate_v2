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

export type TasteAxisName = keyof TasteAxes;

/**
 * The five axes, in the one order everything shows and iterates them in.
 *
 * Here rather than in either package because three separate places now walk
 * this list - the fold on the server, the chart in the app and the confidence
 * beside it - and a fourth axis added to two of them is a bug nothing catches.
 * Fixed rather than sorted by value: a chart whose vertices swap places every
 * time the profile shifts is unreadable, and the point of the chart is to be
 * recognised at a glance a month later.
 */
export const TASTE_AXIS_NAMES: readonly TasteAxisName[] = [
  'acidity',
  'sweetness',
  'body',
  'bitterness',
  'intensity',
];
