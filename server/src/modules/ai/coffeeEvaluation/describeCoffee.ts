import type { ParsedBagData } from '@brewmate/shared';

import { MILLISECONDS_PER_DAY } from '../../../constants/timeUnits.js';
import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
  PROMPT_LIST_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const UNKNOWN = 'not printed on the bag, or not readable';
const NO_NOTES = 'the bag prints no tasting notes, or they could not be read';

/**
 * The coffee, as a list of facts.
 *
 * Everything unknown is stated as unknown rather than left out. A field that
 * simply disappears from the list reads as a field that did not matter, and
 * the whole point of the uncertainties the verdict has to report is that a
 * missing roast date is itself a thing worth saying out loud.
 */
const line = (label: string, value: string | null): string =>
  [PROMPT_BULLET, label, PROMPT_LABEL_SEPARATOR, value ?? UNKNOWN].join('');

const daysSince = (roastDate: string | null | undefined, now: Date): string | null => {
  if (roastDate === null || roastDate === undefined) {
    return null;
  }

  const days = Math.floor((now.getTime() - Date.parse(roastDate)) / MILLISECONDS_PER_DAY);

  return `${roastDate} (${String(days)} days ago)`;
};

const measurement = (value: number | null | undefined): string | null =>
  value === null || value === undefined ? null : String(value);

const notes = (tastingNotes: readonly string[] | undefined): string =>
  tastingNotes === undefined || tastingNotes.length === NOTHING
    ? NO_NOTES
    : tastingNotes.join(PROMPT_LIST_SEPARATOR);

export const describeCoffee = (coffee: ParsedBagData, now: Date): string =>
  [
    'The coffee in front of them:',
    line('Roaster', coffee.roaster ?? null),
    line('Name', coffee.name ?? null),
    line('Country of origin', coffee.originCountry ?? null),
    line('Region', coffee.region ?? null),
    line('Farm', coffee.farm ?? null),
    line('Variety', coffee.variety ?? null),
    line('Processing', coffee.process ?? null),
    line('Roast level', coffee.roastLevel ?? null),
    line('Roast date', daysSince(coffee.roastDate, now)),
    line('Altitude in metres', measurement(coffee.altitude)),
    line('Printed tasting notes', notes(coffee.tastingNotes)),
    line('Net weight in grams', measurement(coffee.weightGrams)),
  ].join(PROMPT_LINE_SEPARATOR);
