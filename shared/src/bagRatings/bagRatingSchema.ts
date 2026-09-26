import { z } from 'zod';

import { BAG_IMPRESSION_VALUES } from '../enums/bagImpressions.js';
import { BAG_RATING_STAGE_VALUES } from '../enums/bagRatingStages.js';
import {
  BAG_RATING_STARS_MAX,
  BAG_RATING_STARS_MIN,
  BAG_RATING_TAGS_MAX,
} from './bagRatingFieldLimits.js';
import { BAG_RATING_TAG_VALUES } from './bagRatingTags.js';

/**
 * What somebody thought of one bag, at one point in drinking it.
 *
 * One per bag and stage. Changing your mind replaces the answer rather than
 * adding a second one, because two ratings of the same bag at the same moment
 * are one opinion that was corrected, not two coffees.
 */
export const bagRatingSchema = z.object({
  id: z.uuid(),
  bagId: z.uuid(),
  stage: z.enum(BAG_RATING_STAGE_VALUES),
  stars: z.number().int().min(BAG_RATING_STARS_MIN).max(BAG_RATING_STARS_MAX),
  impression: z.enum(BAG_IMPRESSION_VALUES).nullable(),
  tags: z.array(z.enum(BAG_RATING_TAG_VALUES)).max(BAG_RATING_TAGS_MAX),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type BagRating = z.infer<typeof bagRatingSchema>;
