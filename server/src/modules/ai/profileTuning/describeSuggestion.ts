import {
  INSIGHT_REASON_KINDS,
  type FlavorAffinities,
  type RoastLevel,
  type SuggestionReason,
} from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const SHARE_PERCENT = 100;
const SHARE_DECIMALS = 0;
const NOTHING = 0;

/** What each reason means, so a bare count is not read as a rating. */
const REASON_MEANINGS = {
  [INSIGHT_REASON_KINDS.roastHistory]:
    'this roast level appeared on the bags behind that many of their cups',
  [INSIGHT_REASON_KINDS.flavorNotes]:
    'this tasting note was printed on the bags behind that many of their cups',
} as const;

const reasonLine = (reason: SuggestionReason): string =>
  [
    PROMPT_BULLET,
    reason.kind,
    PROMPT_LABEL_SEPARATOR,
    reason.value,
    ` - ${String(reason.brewCount)} cups, ${(reason.share * SHARE_PERCENT).toFixed(SHARE_DECIMALS)}% of the history looked at`,
    ` (${REASON_MEANINGS[reason.kind]})`,
  ].join('');

export interface SuggestionDescription {
  readonly brewCount: number;
  readonly roastPreference: RoastLevel | null;
  readonly flavorAffinities: FlavorAffinities;
  readonly currentRoastPreference: RoastLevel | null;
  readonly reasons: readonly SuggestionReason[];
}

const NO_CHANGE = 'unchanged';
const NONE_RECORDED = 'nothing recorded yet';

/**
 * The finished arithmetic, laid out for a model that may only describe it.
 *
 * Both the proposal and what the profile currently says, because the sentence
 * has to be about a change: "z posledných 14 káv bolo 11 svetlo pražených, tvoj
 * profil zatiaľ hovorí stredné" is the whole point, and a model shown only the
 * proposal would write a description of a preference rather than a question
 * about one.
 */
export const describeSuggestion = (description: SuggestionDescription): string => {
  const affinityTags = Object.keys(description.flavorAffinities);

  return [
    'What this person has actually brewed, counted:',
    `${PROMPT_BULLET}cups the report looked at${PROMPT_LABEL_SEPARATOR}${String(description.brewCount)}`,
    ...description.reasons.map(reasonLine),
    '',
    'What their profile says right now:',
    `${PROMPT_BULLET}roast preference${PROMPT_LABEL_SEPARATOR}${description.currentRoastPreference ?? NONE_RECORDED}`,
    '',
    'What would change if they agree:',
    `${PROMPT_BULLET}roast preference${PROMPT_LABEL_SEPARATOR}${description.roastPreference ?? NO_CHANGE}`,
    `${PROMPT_BULLET}flavour notes it would start to expect${PROMPT_LABEL_SEPARATOR}${
      affinityTags.length === NOTHING ? NO_CHANGE : affinityTags.join(', ')
    }`,
    '',
    'Write the explanation now, following your instructions exactly.',
  ].join(PROMPT_LINE_SEPARATOR);
};
