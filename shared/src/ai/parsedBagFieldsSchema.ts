import { z } from 'zod';

import {
  ALTITUDE_MAX,
  ALTITUDE_MIN,
  BAG_WEIGHT_GRAMS_MAX,
  BAG_WEIGHT_GRAMS_MIN,
  COFFEE_NAME_MAX_LENGTH,
  FARM_MAX_LENGTH,
  ORIGIN_COUNTRY_MAX_LENGTH,
  PROCESS_MAX_LENGTH,
  REGION_MAX_LENGTH,
  ROASTER_MAX_LENGTH,
  TASTING_NOTES_MAX,
  TASTING_NOTE_MAX_LENGTH,
  VARIETY_MAX_LENGTH,
} from '../coffeeBags/coffeeBagFieldLimits.js';
import { ROAST_LEVELS } from '../enums/roastLevels.js';

import { parsedFieldSchema } from './parsedFieldSchema.js';

/**
 * A coffee bag as it was read off a photograph.
 *
 * These twelve field names are the strict contract the model answers in - the
 * same names a stored bag uses, so nothing has to be translated between the
 * label, the API and the form. Every one of them carries its own confidence,
 * and anything unreadable is `null` rather than a plausible guess: a wrong
 * roast date saved quietly is a coffee that misreports itself in every recipe
 * afterwards.
 */
export const parsedBagFieldsSchema = z.object({
  roaster: parsedFieldSchema(z.string().max(ROASTER_MAX_LENGTH)),
  name: parsedFieldSchema(z.string().max(COFFEE_NAME_MAX_LENGTH)),
  originCountry: parsedFieldSchema(z.string().max(ORIGIN_COUNTRY_MAX_LENGTH)),
  region: parsedFieldSchema(z.string().max(REGION_MAX_LENGTH)),
  farm: parsedFieldSchema(z.string().max(FARM_MAX_LENGTH)),
  variety: parsedFieldSchema(z.string().max(VARIETY_MAX_LENGTH)),
  process: parsedFieldSchema(z.string().max(PROCESS_MAX_LENGTH)),
  roastLevel: parsedFieldSchema(z.enum(ROAST_LEVELS)),
  roastDate: parsedFieldSchema(z.iso.date()),
  altitude: parsedFieldSchema(z.number().int().min(ALTITUDE_MIN).max(ALTITUDE_MAX)),
  tastingNotes: parsedFieldSchema(
    z.array(z.string().max(TASTING_NOTE_MAX_LENGTH)).max(TASTING_NOTES_MAX),
  ),
  weightGrams: parsedFieldSchema(z.number().min(BAG_WEIGHT_GRAMS_MIN).max(BAG_WEIGHT_GRAMS_MAX)),
});

export type ParsedBagFields = z.infer<typeof parsedBagFieldsSchema>;

/** The field names, in the order a label is usually read. */
export const PARSED_BAG_FIELD_NAMES = [
  'roaster',
  'name',
  'originCountry',
  'region',
  'farm',
  'variety',
  'process',
  'roastLevel',
  'roastDate',
  'altitude',
  'tastingNotes',
  'weightGrams',
] as const;

export type ParsedBagFieldName = (typeof PARSED_BAG_FIELD_NAMES)[number];
