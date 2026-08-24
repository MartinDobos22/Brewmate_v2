import { hasAnyConstraint, type BrewLog, type Recipe } from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

import { describeParams } from './describeBrew.js';

const NOTHING = 0;
const EMPTY = '';
const NEVER_BREWED = 'never actually brewed';
const NO_RATIONALE = 'no reasoning was recorded';

export interface BrewHistoryEntry {
  readonly recipe: Recipe;
  readonly logs: readonly BrewLog[];
}

/**
 * What was tried for this coffee in this brewer before.
 *
 * The pair is the unit, not the coffee: the same beans want a different dose
 * in a V60 than in an AeroPress, and offering yesterday's AeroPress numbers as
 * an improvement on a dripper recipe would be reading one method's history as
 * the other's.
 *
 * Whether each recipe was ever brewed is stated, because an untouched recipe
 * is a suggestion nobody took and carries none of the authority of one that
 * produced a cup. A brew made under constraints is marked for the same reason
 * the learning weight discounts it: what it says about the coffee is muddled
 * with what it says about the kettle.
 *
 * @returns the section, or null when there is nothing to speak of - an empty
 * heading invites a model to reason about an absence.
 */
export const describeBrewHistory = (entries: readonly BrewHistoryEntry[]): string | null => {
  if (entries.length === NOTHING) {
    return null;
  }

  return [
    'What has already been tried with this coffee in this brewer, most recent first:',
    ...entries.map(({ recipe, logs }: BrewHistoryEntry): string => {
      const constrained = logs.some((log: BrewLog): boolean => hasAnyConstraint(log.constraints));

      return [
        PROMPT_BULLET,
        describeParams(recipe.params),
        PROMPT_LABEL_SEPARATOR,
        logs.length === NOTHING
          ? NEVER_BREWED
          : `brewed ${String(logs.length)} time(s)${constrained ? ', at least once with something missing, so read it carefully' : EMPTY}`,
        `. ${recipe.rationale ?? NO_RATIONALE}`,
      ].join(EMPTY);
    }),
  ].join(PROMPT_LINE_SEPARATOR);
};
