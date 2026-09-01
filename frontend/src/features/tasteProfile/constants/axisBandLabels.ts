import { TASTE_AXIS_BANDS, type TasteAxisBand, type TasteAxisName } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * What each point on each axis is called, in words.
 *
 * Twenty-five keys rather than five, and the repetition is the point. Slovak
 * declines the adjective for the noun it belongs to - kyslosť is výrazná,
 * telo is výrazné, and a sentence assembled at the call site from a shared
 * word and an axis name is one no translator ever saw. It also lets each axis
 * say the thing people actually say about it: a low body is "ľahké", not
 * "nízke", and low bitterness is not a deficiency but the whole point.
 *
 * Every axis has all five, including the ones nobody wants. "Veľmi horká" is a
 * real reading and the profile has to be able to print it - a chart that can
 * only describe a coffee flatteringly is one nobody can use to disagree with
 * it.
 */
export const AXIS_BAND_LABEL_KEYS: Record<TasteAxisName, Record<TasteAxisBand, TranslationKey>> = {
  acidity: {
    [TASTE_AXIS_BANDS.veryLow]: TRANSLATION_KEYS.bandAcidityVeryLow,
    [TASTE_AXIS_BANDS.low]: TRANSLATION_KEYS.bandAcidityLow,
    [TASTE_AXIS_BANDS.balanced]: TRANSLATION_KEYS.bandAcidityBalanced,
    [TASTE_AXIS_BANDS.high]: TRANSLATION_KEYS.bandAcidityHigh,
    [TASTE_AXIS_BANDS.veryHigh]: TRANSLATION_KEYS.bandAcidityVeryHigh,
  },
  sweetness: {
    [TASTE_AXIS_BANDS.veryLow]: TRANSLATION_KEYS.bandSweetnessVeryLow,
    [TASTE_AXIS_BANDS.low]: TRANSLATION_KEYS.bandSweetnessLow,
    [TASTE_AXIS_BANDS.balanced]: TRANSLATION_KEYS.bandSweetnessBalanced,
    [TASTE_AXIS_BANDS.high]: TRANSLATION_KEYS.bandSweetnessHigh,
    [TASTE_AXIS_BANDS.veryHigh]: TRANSLATION_KEYS.bandSweetnessVeryHigh,
  },
  body: {
    [TASTE_AXIS_BANDS.veryLow]: TRANSLATION_KEYS.bandBodyVeryLow,
    [TASTE_AXIS_BANDS.low]: TRANSLATION_KEYS.bandBodyLow,
    [TASTE_AXIS_BANDS.balanced]: TRANSLATION_KEYS.bandBodyBalanced,
    [TASTE_AXIS_BANDS.high]: TRANSLATION_KEYS.bandBodyHigh,
    [TASTE_AXIS_BANDS.veryHigh]: TRANSLATION_KEYS.bandBodyVeryHigh,
  },
  bitterness: {
    [TASTE_AXIS_BANDS.veryLow]: TRANSLATION_KEYS.bandBitternessVeryLow,
    [TASTE_AXIS_BANDS.low]: TRANSLATION_KEYS.bandBitternessLow,
    [TASTE_AXIS_BANDS.balanced]: TRANSLATION_KEYS.bandBitternessBalanced,
    [TASTE_AXIS_BANDS.high]: TRANSLATION_KEYS.bandBitternessHigh,
    [TASTE_AXIS_BANDS.veryHigh]: TRANSLATION_KEYS.bandBitternessVeryHigh,
  },
  intensity: {
    [TASTE_AXIS_BANDS.veryLow]: TRANSLATION_KEYS.bandIntensityVeryLow,
    [TASTE_AXIS_BANDS.low]: TRANSLATION_KEYS.bandIntensityLow,
    [TASTE_AXIS_BANDS.balanced]: TRANSLATION_KEYS.bandIntensityBalanced,
    [TASTE_AXIS_BANDS.high]: TRANSLATION_KEYS.bandIntensityHigh,
    [TASTE_AXIS_BANDS.veryHigh]: TRANSLATION_KEYS.bandIntensityVeryHigh,
  },
};
