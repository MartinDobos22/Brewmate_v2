import type { BagEvaluation } from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_HISTORY_TEXT_MAX_LENGTH,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const START = 0;
const UNNAMED = 'a coffee whose label could not be read';
const NAME_SEPARATOR = ' ';
const EMPTY = '';
const NO_VERDICT = 'no verdict was recorded';
const BOUGHT = 'they bought it';
const LEFT = 'they left it on the shelf';
const UNDECIDED = 'they did not say whether they bought it';

const coffeeName = (evaluation: BagEvaluation): string => {
  const name = [evaluation.parsedData.roaster, evaluation.parsedData.name]
    .filter(
      (part: string | null | undefined): part is string =>
        part !== null && part !== undefined && part !== EMPTY,
    )
    .join(NAME_SEPARATOR);

  return name === EMPTY ? UNNAMED : name;
};

const outcome = (wasPurchased: boolean | null): string => {
  if (wasPurchased === null) {
    return UNDECIDED;
  }

  return wasPurchased ? BOUGHT : LEFT;
};

/**
 * What this person has already been told, and what they did about it.
 *
 * Two jobs at once. It keeps the advice consistent - somebody who was warned
 * off a roaster last week should not be sold the same roaster today without a
 * word about it - and it turns the outcomes into evidence: a run of coffees
 * recommended and then left on the shelf says more about the advice than any
 * confidence figure does.
 *
 * @returns the section, or null when there is no history to speak of - an
 * empty heading would invite the model to reason about an absence.
 */
export const describeHistory = (evaluations: readonly BagEvaluation[]): string | null => {
  if (evaluations.length === NOTHING) {
    return null;
  }

  return [
    'Coffees this person has already been advised about, most recent first:',
    ...evaluations.map((evaluation: BagEvaluation): string =>
      [
        PROMPT_BULLET,
        coffeeName(evaluation),
        PROMPT_LABEL_SEPARATOR,
        (evaluation.verdictText ?? NO_VERDICT).slice(START, PROMPT_HISTORY_TEXT_MAX_LENGTH),
        ` — ${outcome(evaluation.wasPurchased)}`,
      ].join(EMPTY),
    ),
  ].join(PROMPT_LINE_SEPARATOR);
};
