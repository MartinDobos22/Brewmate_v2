import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * When each greeting starts, on a 24-hour clock.
 *
 * Read as an ordered ladder rather than as four ranges, so the bands cannot
 * overlap or leave a gap - the hour before the first entry belongs to the
 * night, which is the one band that wraps around midnight.
 */
export const GREETING_START_HOURS = {
  morning: 5,
  day: 10,
  evening: 17,
  night: 22,
} as const;

export type GreetingBand = keyof typeof GREETING_START_HOURS;

/** Latest band first, so the first match down the list is the right one. */
export const GREETING_BANDS: readonly GreetingBand[] = ['night', 'evening', 'day', 'morning'];

export const GREETING_KEYS: Record<GreetingBand, TranslationKey> = {
  morning: TRANSLATION_KEYS.homeGreetingMorning,
  day: TRANSLATION_KEYS.homeGreetingDay,
  evening: TRANSLATION_KEYS.homeGreetingEvening,
  night: TRANSLATION_KEYS.homeGreetingNight,
};
