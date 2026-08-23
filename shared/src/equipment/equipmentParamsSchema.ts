import { z } from 'zod';

import { DOSE_GRAMS_MAX, DOSE_GRAMS_MIN } from '../brewing/brewingFieldLimits.js';
import type { JsonObject } from '../common/jsonValueSchema.js';

import {
  BREWER_CAPACITY_ML_MAX,
  BREWER_CAPACITY_ML_MIN,
  ESPRESSO_BASKET_MM_MAX,
  ESPRESSO_BASKET_MM_MIN,
  SCALE_RESOLUTION_GRAMS_MAX,
  SCALE_RESOLUTION_GRAMS_MIN,
} from './equipmentFieldLimits.js';

/**
 * What a brewer is, beyond its name.
 *
 * `methodId` is the link that makes "offer only the methods I can actually
 * brew" answerable: a V60 in the cupboard points at the V60 row in
 * `brew_methods`, and a method nothing points at is not offered.
 *
 * Every property is optional because a brewer is useful before anyone has
 * measured it - the app says a figure is missing rather than inventing one.
 */
export const brewerParamsSchema = z.object({
  methodId: z.uuid().optional(),
  capacityMl: z.number().min(BREWER_CAPACITY_ML_MIN).max(BREWER_CAPACITY_ML_MAX).optional(),
  doseMinGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX).optional(),
  doseMaxGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX).optional(),
  /** Espresso only: the basket diameter, which decides the dose window. */
  basketSizeMm: z.number().min(ESPRESSO_BASKET_MM_MIN).max(ESPRESSO_BASKET_MM_MAX).optional(),
});

export type BrewerParams = z.infer<typeof brewerParamsSchema>;

/**
 * A kettle, reduced to the one property that changes the advice: whether the
 * water temperature can be chosen. Without it, a recipe cannot ask for 93 °C
 * and a disappointing cup says less about the drinker's taste.
 */
export const kettleParamsSchema = z.object({
  hasTemperatureControl: z.boolean().optional(),
});

export type KettleParams = z.infer<typeof kettleParamsSchema>;

/** A scale, reduced to what it can actually tell the brewer. */
export const scaleParamsSchema = z.object({
  hasTimer: z.boolean().optional(),
  resolutionGrams: z
    .number()
    .min(SCALE_RESOLUTION_GRAMS_MIN)
    .max(SCALE_RESOLUTION_GRAMS_MAX)
    .optional(),
});

export type ScaleParams = z.infer<typeof scaleParamsSchema>;

const NOTHING_KNOWN = {};

/**
 * Reads the typed corner of an open `params` blob.
 *
 * A blob that does not match is read as "nothing known" rather than thrown
 * away or asserted into shape: the column is open by design, so encountering
 * something the schema does not describe is a normal event, not a failure.
 */
const readParams = <TParams>(schema: z.ZodType<TParams>, params: JsonObject): TParams => {
  const parsed = schema.safeParse(params);

  return parsed.success ? parsed.data : schema.parse(NOTHING_KNOWN);
};

export const readBrewerParams = (params: JsonObject): BrewerParams =>
  readParams(brewerParamsSchema, params);

export const readKettleParams = (params: JsonObject): KettleParams =>
  readParams(kettleParamsSchema, params);

export const readScaleParams = (params: JsonObject): ScaleParams =>
  readParams(scaleParamsSchema, params);
