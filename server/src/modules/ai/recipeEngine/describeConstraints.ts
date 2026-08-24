import {
  BREW_CONSTRAINT_NAMES,
  type BrewConstraintName,
  type BrewConstraints,
} from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LINE_SEPARATOR,
  PROMPT_LIST_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const EVERYTHING_AVAILABLE =
  'Nothing is missing today: they have everything the method needs, so write the recipe without hedging any of it.';

/**
 * What this person cannot do this morning.
 *
 * Named flags rather than a sentence, because the answer has to come back with
 * the same names attached to its hints - a hint the interface cannot map onto
 * the checkbox that caused it is a hint printed in the wrong place.
 *
 * The "nothing is missing" case is stated rather than left out. An absent
 * section reads as an unanswered question, and a model that suspects something
 * was withheld hedges the whole recipe.
 */
export const describeConstraints = (constraints: BrewConstraints): string => {
  const active = BREW_CONSTRAINT_NAMES.filter(
    (name: BrewConstraintName): boolean => constraints[name] === true,
  );
  const other = constraints.other ?? [];

  if (active.length === NOTHING && other.length === NOTHING) {
    return EVERYTHING_AVAILABLE;
  }

  return [
    'What they do not have for this brew. Write one hint for each of these, under exactly this machine name:',
    ...active.map((name: BrewConstraintName): string => `${PROMPT_BULLET}${name}`),
    ...(other.length === NOTHING
      ? []
      : [
          `${PROMPT_BULLET}in their own words, with no machine name and no hint entry: ${other.join(PROMPT_LIST_SEPARATOR)}`,
        ]),
  ].join(PROMPT_LINE_SEPARATOR);
};
