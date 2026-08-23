import { PARSED_CONFIDENCE_NONE } from './aiFieldLimits.js';
import type { ParsedBagFields } from './parsedBagFieldsSchema.js';

const nothing = (): { readonly value: null; readonly confidence: number } => ({
  value: null,
  confidence: PARSED_CONFIDENCE_NONE,
});

/**
 * A label nothing could be read from.
 *
 * A first-class outcome rather than an error: a photograph of the back of a
 * bag, a picture taken in the dark, a hand over the whole front. The app fills
 * the form with this and asks the questions itself, which is what it would
 * have done without a camera anyway.
 */
export const EMPTY_PARSED_BAG_FIELDS: ParsedBagFields = {
  roaster: nothing(),
  name: nothing(),
  originCountry: nothing(),
  region: nothing(),
  farm: nothing(),
  variety: nothing(),
  process: nothing(),
  roastLevel: nothing(),
  roastDate: nothing(),
  altitude: nothing(),
  tastingNotes: nothing(),
  weightGrams: nothing(),
};
