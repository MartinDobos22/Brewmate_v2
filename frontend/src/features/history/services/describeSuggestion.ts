import {
  INSIGHT_EXPLANATION_SOURCES,
  INSIGHT_REASON_KINDS,
  ROAST_LEVEL_VALUES,
  type RoastLevel,
  type SuggestionReason,
  type TasteSuggestion,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type Translator } from '../../../i18n';
import { ROAST_LEVEL_LABEL_KEYS } from '../../tasteProfile/constants';

const SENTENCE_SEPARATOR = ' ';

const isRoastLevel = (value: string): value is RoastLevel =>
  ROAST_LEVEL_VALUES.some((level: RoastLevel): boolean => level === value);

/**
 * A value in the words this app has for it, or as it was stored.
 *
 * A roast level is a closed set with Slovak words; a tasting note is the
 * roaster's own vocabulary, and printing "blackcurrant" as it was written is
 * more honest than inventing a translation for a word that belongs to the
 * world - the same rule the profile screen follows for flavour tags and a
 * coffee's variety.
 */
export const describeReasonValue = (reason: SuggestionReason, t: Translator['t']): string =>
  isRoastLevel(reason.value) ? t(ROAST_LEVEL_LABEL_KEYS[reason.value]) : reason.value;

/**
 * The paragraph beside the numbers, written here when no model wrote one.
 *
 * The same arrangement the conversion report has: the arithmetic reaches the
 * app as machine-named reasons carrying their own counts, and the app turns
 * them into Slovak. That is what lets the card say the same thing whether a
 * model was reachable or not - and it is why the line admitting which of the
 * two happened is worth printing rather than hiding.
 */
export const describeSuggestion = (
  suggestion: TasteSuggestion,
  brewCount: number,
  t: Translator['t'],
): string => {
  if (suggestion.explanationSource === INSIGHT_EXPLANATION_SOURCES.model) {
    return suggestion.explanation;
  }

  return [
    ...suggestion.reasons.map((reason: SuggestionReason): string =>
      reason.kind === INSIGHT_REASON_KINDS.roastHistory
        ? t(TRANSLATION_KEYS.suggestionRoastLine, {
            total: brewCount,
            count: reason.brewCount,
            value: describeReasonValue(reason, t),
          })
        : t(TRANSLATION_KEYS.suggestionNoteLine, {
            value: reason.value,
            count: reason.brewCount,
          }),
    ),
    t(TRANSLATION_KEYS.suggestionClosing),
  ].join(SENTENCE_SEPARATOR);
};
