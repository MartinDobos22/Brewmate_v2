import type { CoffeeBag } from '@brewmate/shared';

import { MILLISECONDS_PER_DAY } from '../../../constants/timeUnits.js';
import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
  PROMPT_LIST_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const EMPTY = '';
const UNKNOWN = 'not recorded';
const NO_NOTES = 'none recorded';
const NOT_WRITTEN_DOWN =
  'The beans are not in their cupboard, so almost nothing is known about them. Do not guess at an origin, a processing method or a roast date - write the sound middle of the road for this method and say in the rationale which of those you would need in order to do better.';

const line = (label: string, value: string | null): string =>
  [PROMPT_BULLET, label, PROMPT_LABEL_SEPARATOR, value ?? UNKNOWN].join(EMPTY);

const daysSince = (roastDate: string | null, now: Date): string | null => {
  if (roastDate === null) {
    return null;
  }

  const days = Math.floor((now.getTime() - Date.parse(roastDate)) / MILLISECONDS_PER_DAY);

  return `${roastDate}, which is ${String(days)} days ago`;
};

const measurement = (value: number | null): string | null =>
  value === null ? null : String(value);

const notes = (tastingNotes: readonly string[]): string =>
  tastingNotes.length === NOTHING ? NO_NOTES : tastingNotes.join(PROMPT_LIST_SEPARATOR);

/**
 * The coffee, or the honest absence of one.
 *
 * A quick brew has no bag behind it, and whatever the drinker managed to say
 * about the beans - "svetlá etiópia z pražiarne za rohom", or nothing at all -
 * is the whole of what is known. Handing that over as free text rather than
 * pretending it is a record is what keeps the recipe from being written as if
 * a roast date had been read somewhere.
 */
export const describeCoffeeForBrew = (
  bag: CoffeeBag | null,
  description: string | null,
  now: Date,
): string => {
  if (bag === null) {
    return [
      NOT_WRITTEN_DOWN,
      ...(description === null || description === EMPTY
        ? []
        : [line('What they said about the beans, in their own words', description)]),
    ].join(PROMPT_LINE_SEPARATOR);
  }

  return [
    'The coffee:',
    line('Roaster', bag.roaster),
    line('Name', bag.name),
    line('Country of origin', bag.originCountry),
    line('Region', bag.region),
    line('Farm', bag.farm),
    line('Variety', bag.variety),
    line('Processing', bag.process),
    line('Roast level', bag.roastLevel),
    line('Roasted on', daysSince(bag.roastDate, now)),
    line('Altitude in metres', measurement(bag.altitude)),
    line('Tasting notes printed on the bag', notes(bag.tastingNotes)),
    line('Grams left in the bag', measurement(bag.remainingGrams)),
  ].join(PROMPT_LINE_SEPARATOR);
};
