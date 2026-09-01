import {
  MATCH_BANDS,
  MATCH_DIRECTIONS,
  type MatchBand,
  type MatchDirection,
  type TasteAxisName,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * How a coffee misses on one axis, said the way a person would say it.
 *
 * Per axis rather than one shared pair of words, for the reason the axis bands
 * already are: Slovak declines the adjective for the noun, and "viac kyslosti"
 * and "plnšie telo" are not the same sentence with a word swapped. Ten strings
 * is the cost of ten sentences that read like somebody wrote them.
 */
export const MATCH_DIRECTION_KEYS: Record<
  TasteAxisName,
  Record<Exclude<MatchDirection, 'aligned'>, TranslationKey>
> = {
  acidity: {
    [MATCH_DIRECTIONS.above]: TRANSLATION_KEYS.matchAcidityAbove,
    [MATCH_DIRECTIONS.below]: TRANSLATION_KEYS.matchAcidityBelow,
  },
  sweetness: {
    [MATCH_DIRECTIONS.above]: TRANSLATION_KEYS.matchSweetnessAbove,
    [MATCH_DIRECTIONS.below]: TRANSLATION_KEYS.matchSweetnessBelow,
  },
  body: {
    [MATCH_DIRECTIONS.above]: TRANSLATION_KEYS.matchBodyAbove,
    [MATCH_DIRECTIONS.below]: TRANSLATION_KEYS.matchBodyBelow,
  },
  bitterness: {
    [MATCH_DIRECTIONS.above]: TRANSLATION_KEYS.matchBitternessAbove,
    [MATCH_DIRECTIONS.below]: TRANSLATION_KEYS.matchBitternessBelow,
  },
  intensity: {
    [MATCH_DIRECTIONS.above]: TRANSLATION_KEYS.matchIntensityAbove,
    [MATCH_DIRECTIONS.below]: TRANSLATION_KEYS.matchIntensityBelow,
  },
};

/** What an axis that already sits where somebody likes it is called. */
export const MATCH_ALIGNED_KEYS: Record<TasteAxisName, TranslationKey> = {
  acidity: TRANSLATION_KEYS.matchAcidityAligned,
  sweetness: TRANSLATION_KEYS.matchSweetnessAligned,
  body: TRANSLATION_KEYS.matchBodyAligned,
  bitterness: TRANSLATION_KEYS.matchBitternessAligned,
  intensity: TRANSLATION_KEYS.matchIntensityAligned,
};

/**
 * The headline, and the one place the app is allowed to summarise the fit.
 *
 * Four sentences rather than a score, a percentage or a colour. A number in
 * front of a shelf reads as a measurement of somebody's taste and nobody has
 * measured that - and `mixed` is written as a real answer rather than as a
 * shrug, because a coffee that suits somebody's body and not their acidity
 * genuinely is both.
 */
export const MATCH_BAND_KEYS: Record<MatchBand, TranslationKey> = {
  [MATCH_BANDS.match]: TRANSLATION_KEYS.matchBandMatch,
  [MATCH_BANDS.mixed]: TRANSLATION_KEYS.matchBandMixed,
  [MATCH_BANDS.mismatch]: TRANSLATION_KEYS.matchBandMismatch,
  [MATCH_BANDS.unknown]: TRANSLATION_KEYS.matchBandUnknown,
};
