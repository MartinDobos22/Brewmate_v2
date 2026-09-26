import type { TileGlyph } from '../../../components/ui';

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

/** The mark beside how well the app claims to know somebody. */
export const CONFIDENCE_ICON = 'brain';

/**
 * The mark on the caveat beside a recommendation.
 *
 * The same glyph the shop verdict uses for what it did not know about the
 * person, because that is exactly what this sentence says. One question about
 * the reader, drawn the same way wherever the app admits to having it.
 */
export const CONFIDENCE_NOTICE_ICON = 'account-question-outline' satisfies TileGlyph;
