import { toParsedBagData, type ParsedBagFields } from '@brewmate/shared';

import { MILLISECONDS_PER_DAY } from '../../../constants/time';
import { TASTING_NOTES_JOIN } from '../constants/coffeeBagForm';

import { EMPTY_COFFEE_BAG_FORM, type CoffeeBagFormValues } from './coffeeBagForm';

const EMPTY = '';

const text = (value: string | null): string => value ?? EMPTY;

const measurement = (value: number | null): string => (value === null ? EMPTY : String(value));

/**
 * A roast date, back as the number of days a person would say out loud.
 *
 * Floored rather than rounded: a bag roasted late yesterday is one day old, not
 * two, and the resting bands the cupboard prints are read off this number.
 */
const daysSince = (roastDate: string | null, now: Date): number | null => {
  if (roastDate === null) {
    return null;
  }

  const days = Math.floor((now.getTime() - Date.parse(roastDate)) / MILLISECONDS_PER_DAY);

  return Number.isFinite(days) ? days : null;
};

/**
 * A photographed label, in the boxes somebody can correct it in.
 *
 * The confidences are dropped here on purpose: they do not belong in the
 * values, they belong beside them. Which fields are worth a second look is
 * asked separately, by `lowConfidenceFieldNames`, so editing a box never
 * changes what the form claims the camera was sure of.
 */
export const parsedBagToForm = (
  fields: ParsedBagFields,
  now: Date = new Date(),
): CoffeeBagFormValues => {
  const parsed = toParsedBagData(fields);

  return {
    ...EMPTY_COFFEE_BAG_FORM,
    name: text(parsed.name ?? null),
    roaster: text(parsed.roaster ?? null),
    originCountry: text(parsed.originCountry ?? null),
    region: text(parsed.region ?? null),
    farm: text(parsed.farm ?? null),
    variety: text(parsed.variety ?? null),
    process: text(parsed.process ?? null),
    tastingNotes: (parsed.tastingNotes ?? []).join(TASTING_NOTES_JOIN),
    roastLevel: parsed.roastLevel ?? null,
    daysSinceRoast: daysSince(parsed.roastDate ?? null, now),
    altitude: measurement(parsed.altitude ?? null),
    weightGrams: measurement(parsed.weightGrams ?? null),
  };
};
