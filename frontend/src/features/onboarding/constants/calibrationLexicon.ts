import { TRANSLATION_KEYS } from '../../../i18n';

import type { CalibrationEntry } from '../services/calibrationLexiconTypes';

/**
 * How Slovak drinkers actually describe a cup, and what that says about what
 * they want next time.
 *
 * The axis values are preferences, not measurements: "bola príliš kyslá" is a
 * complaint about this cup and a statement about the next one, so it reads as
 * a low acidity preference rather than a high acidity observation.
 *
 * Order is the whole mechanism. The specific phrasings come first, so
 * "nebola horká" is matched before the bare "hork" inside it, and each axis is
 * claimed only once - the first entry that speaks about it wins.
 */
export const CALIBRATION_LEXICON: readonly CalibrationEntry[] = [
  {
    terms: ['nebola kysl', 'malo kysl', 'menej kysl', 'chybala kysl', 'ploch', 'nevyrazn'],
    reading: { id: 'acidityLow', labelKey: TRANSLATION_KEYS.readingAcidityLow },
    axes: { acidity: 7.5 },
  },
  {
    terms: ['prilis kysl', 'moc kysl', 'kysl', 'ostr', 'stipav', 'octov'],
    reading: { id: 'acidityHigh', labelKey: TRANSLATION_KEYS.readingAcidityHigh },
    axes: { acidity: 3 },
  },
  {
    terms: ['nebola hork', 'horkost sedela', 'prijemne hork'],
    reading: { id: 'bitternessLow', labelKey: TRANSLATION_KEYS.readingBitternessLow },
    axes: { bitterness: 6 },
  },
  {
    terms: ['hork', 'trpk', 'prepalen', 'spalen', 'pripalen'],
    reading: { id: 'bitternessHigh', labelKey: TRANSLATION_KEYS.readingBitternessHigh },
    axes: { bitterness: 3 },
  },
  {
    terms: ['chybala sladk', 'malo sladk', 'nesladk', 'nebola sladk', 'such'],
    reading: { id: 'sweetnessLow', labelKey: TRANSLATION_KEYS.readingSweetnessLow },
    axes: { sweetness: 8 },
  },
  {
    terms: ['sladk', 'karamel', 'medov'],
    reading: { id: 'sweetnessHigh', labelKey: TRANSLATION_KEYS.readingSweetnessHigh },
    axes: { sweetness: 7 },
  },
  {
    terms: ['vodov', 'tenk', 'riedk', 'prazdn', 'chudobn'],
    reading: { id: 'bodyLow', labelKey: TRANSLATION_KEYS.readingBodyLow },
    axes: { body: 7.5 },
  },
  {
    terms: ['prilis hust', 'moc hust', 'tazk', 'mastn'],
    reading: { id: 'bodyHigh', labelKey: TRANSLATION_KEYS.readingBodyHigh },
    axes: { body: 4 },
  },
  {
    terms: ['prilis siln', 'moc siln', 'prehnan', 'prilis vyrazn'],
    reading: { id: 'intensityHigh', labelKey: TRANSLATION_KEYS.readingIntensityHigh },
    axes: { intensity: 4 },
  },
  {
    terms: ['slab', 'malo vyrazn', 'nevycitil'],
    reading: { id: 'intensityLow', labelKey: TRANSLATION_KEYS.readingIntensityLow },
    axes: { intensity: 8 },
  },
  {
    terms: ['vyvazen', 'akurat', 'vyborn', 'super', 'sedela', 'chutila'],
    reading: { id: 'balanced', labelKey: TRANSLATION_KEYS.readingBalanced },
    axes: {},
  },
];
