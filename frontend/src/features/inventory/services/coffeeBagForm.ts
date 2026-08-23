import type { CreateCoffeeBagRequest, ParsedBagData, RoastLevel } from '@brewmate/shared';

import { MILLISECONDS_PER_DAY } from '../../../constants/time';
import { TASTING_NOTES_SEPARATOR } from '../constants/coffeeBagForm';

const TIME_SEPARATOR = 'T';
const EMPTY = '';
const DECIMAL_COMMA = ',';
const DECIMAL_POINT = '.';

/**
 * What somebody can say about a bag: the one read off a label in a shop, and
 * the one written into the cupboard by hand.
 *
 * Every field may be left alone. The roast date is asked for as "how many days
 * ago", because that is the arithmetic a person does in their head in front of
 * a shelf, and a date picker is not what anybody wants to operate one-handed.
 *
 * The measurements stay text until they are sent: a Slovak keyboard writes
 * 250,5 and a half-typed number is a normal state for a field somebody is
 * still filling in.
 */
export interface CoffeeBagFormValues {
  readonly name: string;
  readonly roaster: string;
  readonly originCountry: string;
  readonly region: string;
  readonly farm: string;
  readonly variety: string;
  readonly process: string;
  readonly tastingNotes: string;
  readonly roastLevel: RoastLevel | null;
  readonly daysSinceRoast: number | null;
  readonly altitude: string;
  readonly weightGrams: string;
}

export const EMPTY_COFFEE_BAG_FORM: CoffeeBagFormValues = {
  name: EMPTY,
  roaster: EMPTY,
  originCountry: EMPTY,
  region: EMPTY,
  farm: EMPTY,
  variety: EMPTY,
  process: EMPTY,
  tastingNotes: EMPTY,
  roastLevel: null,
  daysSinceRoast: null,
  altitude: EMPTY,
  weightGrams: EMPTY,
};

/** The notes as they were printed, one per entry, without the empty ones. */
export const readTastingNotes = (text: string): readonly string[] =>
  text
    .split(TASTING_NOTES_SEPARATOR)
    .map((note: string): string => note.trim())
    .filter((note: string): boolean => note !== EMPTY);

/** An ISO calendar day: a roast date has no time and no timezone. */
const toIsoDay = (date: Date): string => {
  const [day = EMPTY] = date.toISOString().split(TIME_SEPARATOR);

  return day;
};

const readRoastDate = (daysSinceRoast: number | null, now: Date): string | null =>
  daysSinceRoast === null
    ? null
    : toIsoDay(new Date(now.getTime() - daysSinceRoast * MILLISECONDS_PER_DAY));

const trimmed = (value: string): string | null => (value.trim() === EMPTY ? null : value.trim());

/**
 * A typed measurement, or null.
 *
 * Null for anything that is not a finite number, which includes the empty box
 * and the moment somebody has typed a lone minus sign. A field left alone must
 * never arrive as zero - "not recorded" and "zero grams" are different facts.
 */
const measurement = (value: string): number | null => {
  const parsed = Number(value.trim().replace(DECIMAL_COMMA, DECIMAL_POINT));

  return value.trim() === EMPTY || !Number.isFinite(parsed) ? null : parsed;
};

const wholeMeasurement = (value: string): number | null => {
  const parsed = measurement(value);

  return parsed === null ? null : Math.round(parsed);
};

/**
 * The label as the API stores it.
 *
 * Nothing is filled in on the user's behalf: a field they left alone stays
 * null, so a verdict can say it did not see it rather than quietly assuming a
 * medium roast.
 */
export const toParsedBagData = (
  values: CoffeeBagFormValues,
  now: Date = new Date(),
): ParsedBagData => ({
  name: trimmed(values.name) ?? undefined,
  roaster: trimmed(values.roaster),
  originCountry: trimmed(values.originCountry),
  region: trimmed(values.region),
  farm: trimmed(values.farm),
  variety: trimmed(values.variety),
  process: trimmed(values.process),
  roastLevel: values.roastLevel,
  roastDate: readRoastDate(values.daysSinceRoast, now),
  altitude: wholeMeasurement(values.altitude),
  tastingNotes: [...readTastingNotes(values.tastingNotes)],
  weightGrams: measurement(values.weightGrams),
});

/**
 * The same bag, on its way into the cupboard once it was actually bought.
 *
 * A bag opens full: `remainingGrams` starts at the printed weight, so the
 * cupboard can count down from something real rather than asking somebody to
 * type the same number twice.
 */
export const toCreateCoffeeBagRequest = (
  values: CoffeeBagFormValues,
  fallbackName: string,
  now: Date = new Date(),
): CreateCoffeeBagRequest => {
  const weightGrams = measurement(values.weightGrams);

  return {
    ...toParsedBagData(values, now),
    name: trimmed(values.name) ?? fallbackName,
    weightGrams,
    remainingGrams: weightGrams,
  };
};
