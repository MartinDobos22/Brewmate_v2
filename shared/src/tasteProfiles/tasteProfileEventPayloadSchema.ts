import { z } from 'zod';

import { BAG_RATING_STAGE_VALUES } from '../enums/bagRatingStages.js';
import { MILK_USAGE_LEVELS } from '../enums/milkUsage.js';
import { ROAST_LEVELS } from '../enums/roastLevels.js';

import { flavorAffinitiesSchema } from './flavorAffinitiesSchema.js';
import { partialTasteAxesConfidenceSchema } from './tasteAxisConfidenceSchema.js';
import { partialTasteAxesSchema } from './tasteAxesSchema.js';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  EVENT_NOTE_MAX_LENGTH,
} from './tasteProfileFieldLimits.js';

/**
 * The raw observation, exactly as it arrived. Kept verbatim so a replay starts
 * from the input rather than from a conclusion drawn about it.
 */
export const tasteProfileEventPayloadSchema = z.object({
  axes: partialTasteAxesSchema,
  /**
   * How firmly this observation speaks about each axis it names, 0..1.
   *
   * Separate from `weight` because one observation is rarely equally sure of
   * everything it says. A questionnaire that asked five questions touching
   * acidity and got five compatible answers knows that axis far better than
   * the one it inferred from a single remark about chocolate - and if those
   * five answers had contradicted each other, it knows it less well than
   * either. An axis left out is taken as fully weighted, so an observation
   * that has no opinion about the difference simply says nothing.
   */
  axisWeights: partialTasteAxesConfidenceSchema.optional(),
  flavorAffinities: flavorAffinitiesSchema.optional(),
  roastPreference: z.enum(ROAST_LEVELS).nullable().optional(),
  milkUsage: z.enum(MILK_USAGE_LEVELS).nullable().optional(),
  /** How much this observation should count, before the source is weighed in. */
  weight: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX).optional(),
  note: z.string().max(EVENT_NOTE_MAX_LENGTH).optional(),
  /**
   * The bag an observation is about, where it is about one.
   *
   * A purchase and the ratings of the same bag have to be read together: a
   * later rating decides how much the purchase is still worth, and a rating
   * given again for the same stage replaces the earlier one. Both of those
   * are decided by the fold from the trail, so the link travels on the event
   * rather than being looked up somewhere the replay cannot see.
   */
  bagId: z.uuid().optional(),
  ratingStage: z.enum(BAG_RATING_STAGE_VALUES).optional(),
  /**
   * How much of the purchase of this bag a rating leaves standing, 0..1.
   *
   * "Presne toto som chcel" leaves all of it; "chutí mi, ale čakal som niečo
   * iné" leaves little, because choosing it turned out to say less about
   * what this person wants than it seemed to on the day.
   */
  purchaseFactor: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX).optional(),
});

export type TasteProfileEventPayload = z.infer<typeof tasteProfileEventPayloadSchema>;
