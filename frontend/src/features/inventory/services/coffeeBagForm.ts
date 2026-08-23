import type { CreateCoffeeBagRequest, ParsedBagData, RoastLevel } from '@brewmate/shared';

import { MILLISECONDS_PER_DAY } from '../../../constants/time';
import { TASTING_NOTES_SEPARATOR } from '../constants/coffeeBagForm';

const TIME_SEPARATOR = 'T';
const EMPTY = '';

/**
 * What somebody can say about a bag: the one read off a label in a shop, and
 * the one written into the cupboard by hand.
 *
 * Every field may be left alone. The roast date is asked for as "how many days
 * ago", because that is the arithmetic a person does in their head in front of
 * a shelf, and a date picker is not what anybody wants to operate one-handed.
 */
export interface CoffeeBagFormValues {
  readonly name: string;
  readonly roaster: string;
  readonly originCountry: string;
  readonly tastingNotes: string;
  readonly roastLevel: RoastLevel | null;
  readonly daysSinceRoast: number | null;
}

export const EMPTY_COFFEE_BAG_FORM: CoffeeBagFormValues = {
  name: EMPTY,
  roaster: EMPTY,
  originCountry: EMPTY,
  tastingNotes: EMPTY,
  roastLevel: null,
  daysSinceRoast: null,
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
  roastLevel: values.roastLevel,
  roastDate: readRoastDate(values.daysSinceRoast, now),
  tastingNotes: [...readTastingNotes(values.tastingNotes)],
});

/** The same bag, on its way into the cupboard once it was actually bought. */
export const toCreateCoffeeBagRequest = (
  values: CoffeeBagFormValues,
  fallbackName: string,
  now: Date = new Date(),
): CreateCoffeeBagRequest => ({
  name: trimmed(values.name) ?? fallbackName,
  roaster: trimmed(values.roaster),
  originCountry: trimmed(values.originCountry),
  roastLevel: values.roastLevel,
  roastDate: readRoastDate(values.daysSinceRoast, now),
  tastingNotes: [...readTastingNotes(values.tastingNotes)],
});
