import { z } from 'zod';

import { coffeeBagSchema } from '../coffeeBags/coffeeBagSchema.js';

/**
 * What could be read off the label.
 *
 * Every field is optional because a photograph of a bag in a shop is a partial
 * source: the roast date may be hidden by a thumb, the altitude may not be
 * printed at all. Turning this into a real bag is a separate, deliberate step.
 */
export const parsedBagDataSchema = coffeeBagSchema
  .omit({
    id: true,
    userId: true,
    remainingGrams: true,
    isArchived: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type ParsedBagData = z.infer<typeof parsedBagDataSchema>;
