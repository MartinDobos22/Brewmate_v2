import type { TranslationKey } from '../../../i18n';
import {
  GREETING_BANDS,
  GREETING_KEYS,
  GREETING_START_HOURS,
  type GreetingBand,
} from '../constants/homeGreeting';

/**
 * Which greeting the clock has earned.
 *
 * The phone's own hour, not the server's: this is the one thing on the screen
 * that is about where the reader is standing rather than about their account,
 * and a server that guessed a timezone would greet somebody good morning at
 * midnight.
 *
 * The bands are walked latest-first, so the hours before the earliest one fall
 * through to the night - which is the band that wraps around midnight and the
 * only one a range check would get wrong.
 */
export const resolveGreetingKey = (now: Date = new Date()): TranslationKey => {
  const hour = now.getHours();
  const band =
    GREETING_BANDS.find(
      (candidate: GreetingBand): boolean => hour >= GREETING_START_HOURS[candidate],
    ) ?? 'night';

  return GREETING_KEYS[band];
};
