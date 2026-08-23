import { CONFIDENCE_LEVELS, type ConfidenceLevel } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The bands themselves live in `@brewmate/shared`: the server writes the shop
 * verdict and has to admit the same amount of ignorance the screen does, so
 * both sides read one definition. What stays here is the only part that is the
 * app's business - which Slovak word each band is printed as.
 */
export { CONFIDENCE_LEVELS, CONFIDENCE_THRESHOLDS } from '@brewmate/shared';
export type { ConfidenceLevel } from '@brewmate/shared';

export const CONFIDENCE_LABEL_KEYS: Record<ConfidenceLevel, TranslationKey> = {
  [CONFIDENCE_LEVELS.none]: TRANSLATION_KEYS.profileConfidenceNone,
  [CONFIDENCE_LEVELS.low]: TRANSLATION_KEYS.profileConfidenceLow,
  [CONFIDENCE_LEVELS.medium]: TRANSLATION_KEYS.profileConfidenceMedium,
  [CONFIDENCE_LEVELS.high]: TRANSLATION_KEYS.profileConfidenceHigh,
};
