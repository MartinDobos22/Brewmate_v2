import { z } from 'zod';

import { ROAST_LEVELS } from '../enums/roastLevels.js';

import {
  ALTITUDE_MAX,
  ALTITUDE_MIN,
  BAG_REMAINING_GRAMS_MIN,
  BAG_WEIGHT_GRAMS_MAX,
  BAG_WEIGHT_GRAMS_MIN,
  COFFEE_NAME_MAX_LENGTH,
  FARM_MAX_LENGTH,
  IMAGE_URL_MAX_LENGTH,
  ORIGIN_COUNTRY_MAX_LENGTH,
  PROCESS_MAX_LENGTH,
  REGION_MAX_LENGTH,
  ROASTER_MAX_LENGTH,
  TASTING_NOTES_MAX,
  TASTING_NOTE_MAX_LENGTH,
  VARIETY_MAX_LENGTH,
} from './coffeeBagFieldLimits.js';

/**
 * A bag of coffee.
 *
 * `roastDate` is a `date`, not a timestamp: a roast date has no time and no
 * timezone, and storing it as one would shift it across zones and put the
 * resting window a day out.
 *
 * A bag is archived rather than deleted, because brew logs point at it and a
 * finished bag is the most valuable history the app has.
 */
export const coffeeBagSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  roaster: z.string().max(ROASTER_MAX_LENGTH).nullable(),
  name: z.string().min(1).max(COFFEE_NAME_MAX_LENGTH),
  originCountry: z.string().max(ORIGIN_COUNTRY_MAX_LENGTH).nullable(),
  region: z.string().max(REGION_MAX_LENGTH).nullable(),
  farm: z.string().max(FARM_MAX_LENGTH).nullable(),
  variety: z.string().max(VARIETY_MAX_LENGTH).nullable(),
  process: z.string().max(PROCESS_MAX_LENGTH).nullable(),
  roastLevel: z.enum(ROAST_LEVELS).nullable(),
  roastDate: z.iso.date().nullable(),
  altitude: z.number().int().min(ALTITUDE_MIN).max(ALTITUDE_MAX).nullable(),
  tastingNotes: z.array(z.string().max(TASTING_NOTE_MAX_LENGTH)).max(TASTING_NOTES_MAX),
  weightGrams: z.number().min(BAG_WEIGHT_GRAMS_MIN).max(BAG_WEIGHT_GRAMS_MAX).nullable(),
  remainingGrams: z.number().min(BAG_REMAINING_GRAMS_MIN).max(BAG_WEIGHT_GRAMS_MAX).nullable(),
  imageUrl: z.url().max(IMAGE_URL_MAX_LENGTH).nullable(),
  isArchived: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type CoffeeBag = z.infer<typeof coffeeBagSchema>;
