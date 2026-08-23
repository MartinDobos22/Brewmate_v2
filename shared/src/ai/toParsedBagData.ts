import type { ParsedBagData } from '../bagEvaluations/parsedBagDataSchema.js';

import type { ParsedBagFields } from './parsedBagFieldsSchema.js';

const NO_TASTING_NOTES: readonly string[] = [];

/**
 * The reading, stripped of how sure it was.
 *
 * Both sides need this - the app to fill in a form, the API to argue about the
 * coffee - so it lives in the contract rather than being written twice. The
 * confidences are dropped rather than folded in: they say how much to trust
 * the fields, which is a question for the interface, not for the data.
 */
export const toParsedBagData = (fields: ParsedBagFields): ParsedBagData => ({
  roaster: fields.roaster.value,
  name: fields.name.value ?? undefined,
  originCountry: fields.originCountry.value,
  region: fields.region.value,
  farm: fields.farm.value,
  variety: fields.variety.value,
  process: fields.process.value,
  roastLevel: fields.roastLevel.value,
  roastDate: fields.roastDate.value,
  altitude: fields.altitude.value,
  tastingNotes: [...(fields.tastingNotes.value ?? NO_TASTING_NOTES)],
  weightGrams: fields.weightGrams.value,
});
