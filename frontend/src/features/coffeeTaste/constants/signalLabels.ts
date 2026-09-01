import { COFFEE_SIGNAL_SOURCES, type CoffeeSignalSource } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * What each kind of evidence is called, for the line that says what the
 * estimate rests on.
 *
 * That line is not decoration. An estimate drawn from a country alone and one
 * drawn from a full label are five numbers either way, and the difference
 * between them is the difference between a guess and a reading - which the
 * shape on its own cannot show.
 */
export const SIGNAL_LABEL_KEYS: Record<CoffeeSignalSource, TranslationKey> = {
  [COFFEE_SIGNAL_SOURCES.roastLevel]: TRANSLATION_KEYS.coffeeSignalRoast,
  [COFFEE_SIGNAL_SOURCES.process]: TRANSLATION_KEYS.coffeeSignalProcess,
  [COFFEE_SIGNAL_SOURCES.origin]: TRANSLATION_KEYS.coffeeSignalOrigin,
  [COFFEE_SIGNAL_SOURCES.altitude]: TRANSLATION_KEYS.coffeeSignalAltitude,
  [COFFEE_SIGNAL_SOURCES.variety]: TRANSLATION_KEYS.coffeeSignalVariety,
  [COFFEE_SIGNAL_SOURCES.tastingNotes]: TRANSLATION_KEYS.coffeeSignalNotes,
  [COFFEE_SIGNAL_SOURCES.modelReading]: TRANSLATION_KEYS.coffeeSignalModel,
};
