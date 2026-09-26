import type { TasteProfile } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { CONFIDENCE_LEVELS } from '../constants/confidenceLevels';

import { resolveConfidenceLevel } from './resolveConfidenceLevel';

const NOTHING_RATED = 0;

/**
 * The sentence that has to sit next to a recommendation, or `null` when the
 * profile has earned the right to be quiet.
 *
 * Three cases rather than one, because they are three different admissions: an
 * app that knows nothing is guessing outright, an app that has only the
 * questionnaire is repeating what somebody said about chocolate and tea, and
 * an app with a couple of rated coffees behind it is early rather than blind.
 * Brews are not among them: how a cup came out teaches the recipe, not which
 * coffee to buy.
 *
 * Above `medium` there is no notice. A caveat that never goes away is read as
 * boilerplate, and then the honest ones stop being read too.
 */
export const resolveConfidenceNoticeKey = (profile: TasteProfile): TranslationKey | null => {
  const level = resolveConfidenceLevel(profile.confidenceLevel);

  if (level === CONFIDENCE_LEVELS.none) {
    return TRANSLATION_KEYS.confidenceNoticeNone;
  }

  if (level !== CONFIDENCE_LEVELS.low) {
    return null;
  }

  return profile.ratedBagCount === NOTHING_RATED
    ? TRANSLATION_KEYS.confidenceNoticeQuestionnaire
    : TRANSLATION_KEYS.confidenceNoticeFewRatings;
};
