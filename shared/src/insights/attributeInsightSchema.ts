import { z } from 'zod';

import { INSIGHT_ATTRIBUTES } from './insightAttributes.js';
import { INSIGHT_VALUE_MAX_LENGTH } from './insightFieldLimits.js';

/**
 * One value of one attribute, and what this account has actually done with it.
 *
 * Every field here is a count of something that happened, because nothing in
 * this product measures how much somebody liked a cup. `brewCount` is how
 * often they made it, `pinnedCount` is how often they kept the recipe, and
 * `evidence` is the summed learning weight of those brews - so a fortnight of
 * cups made with no scale and no thermometer is worth visibly less than a
 * fortnight of measured ones.
 *
 * The app says what each number is rather than turning them into a score. A
 * percentage here would read as a measurement of somebody's taste, and nobody
 * has measured that.
 */
export const attributeInsightSchema = z.object({
  attribute: z.enum(INSIGHT_ATTRIBUTES),
  /**
   * Free text for an origin or a process, a roast level key for a roast. Both
   * are printed as stored where the app has no word of its own for them, the
   * way a coffee's variety is - that vocabulary belongs to the world.
   */
  value: z.string().max(INSIGHT_VALUE_MAX_LENGTH),
  bagCount: z.number().int().nonnegative(),
  brewCount: z.number().int().nonnegative(),
  pinnedCount: z.number().int().nonnegative(),
  /** Summed `profileLearningWeight` of the brews behind the count. */
  evidence: z.number().nonnegative(),
});

export type AttributeInsight = z.infer<typeof attributeInsightSchema>;
