import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import type { TextTone } from '../../../components/ui';

/**
 * What happened after a verdict, as a value rather than a sentence.
 *
 * "Undecided" is a real third answer, not a missing one: somebody who asked
 * about a bag and never came back to say is the ordinary case, and folding
 * that into "nechal si ju tam" would put a decision in their mouth.
 */
export const SCAN_OUTCOMES = {
  bought: 'bought',
  left: 'left',
  undecided: 'undecided',
} as const;

export type ScanOutcome = (typeof SCAN_OUTCOMES)[keyof typeof SCAN_OUTCOMES];

export const SCAN_OUTCOME_LABEL_KEYS: Record<ScanOutcome, TranslationKey> = {
  [SCAN_OUTCOMES.bought]: TRANSLATION_KEYS.scanHistoryBought,
  [SCAN_OUTCOMES.left]: TRANSLATION_KEYS.scanHistoryLeft,
  [SCAN_OUTCOMES.undecided]: TRANSLATION_KEYS.scanHistoryUndecided,
};

/**
 * Buying is the only one of the three drawn in a colour, and it is not a
 * grade: it marks the coffees this account actually took home, which is what
 * somebody is scanning the list for. Leaving a bag on the shelf is not a
 * failure and is not coloured as one.
 */
export const SCAN_OUTCOME_TONES: Record<ScanOutcome, TextTone> = {
  [SCAN_OUTCOMES.bought]: 'secondary',
  [SCAN_OUTCOMES.left]: 'muted',
  [SCAN_OUTCOMES.undecided]: 'muted',
};
