import { z } from 'zod';

import { bagRatingSchema } from './bagRatingSchema.js';

/**
 * Body of `PUT /bag-ratings`.
 *
 * A put rather than a post, because it is: the bag and the stage name the one
 * rating this is, and sending it again replaces it. The impression and the
 * tags are optional - three taps of stars is a complete answer.
 */
export const rateBagRequestSchema = bagRatingSchema
  .pick({ bagId: true, stage: true, stars: true })
  .extend({
    impression: bagRatingSchema.shape.impression.optional(),
    tags: bagRatingSchema.shape.tags.optional(),
  })
  .strict();

export type RateBagRequest = z.infer<typeof rateBagRequestSchema>;
