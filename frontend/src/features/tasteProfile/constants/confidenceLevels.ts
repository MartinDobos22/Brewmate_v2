import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/** How well Brewmate claims to know somebody, as a person would say it. */
export const CONFIDENCE_LEVELS = {
  none: 'none',
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[keyof typeof CONFIDENCE_LEVELS];

/**
 * Where the stored `confidenceLevel` crosses from one word to the next.
 *
 * A questionnaire on its own lands around 0.12, which is deliberately still
 * "len zhruba": ten answers about chocolate and tea are a starting point, not
 * an understanding.
 */
export const CONFIDENCE_THRESHOLDS = {
  low: 0.05,
  medium: 0.35,
  high: 0.7,
} as const;

export const CONFIDENCE_LABEL_KEYS: Record<ConfidenceLevel, TranslationKey> = {
  [CONFIDENCE_LEVELS.none]: TRANSLATION_KEYS.profileConfidenceNone,
  [CONFIDENCE_LEVELS.low]: TRANSLATION_KEYS.profileConfidenceLow,
  [CONFIDENCE_LEVELS.medium]: TRANSLATION_KEYS.profileConfidenceMedium,
  [CONFIDENCE_LEVELS.high]: TRANSLATION_KEYS.profileConfidenceHigh,
};
