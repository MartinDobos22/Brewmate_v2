/**
 * Where a taste profile event came from. The source decides how much the
 * event is trusted, so it is a closed set the reducer branches on.
 */
export const TASTE_PROFILE_SOURCES = {
  questionnaire: 'questionnaire',
  calibrationBrew: 'calibration_brew',
  brewChat: 'brew_chat',
  brewHistory: 'brew_history',
  manual: 'manual',
  /** A bag written into the cupboard: somebody chose this coffee. */
  purchase: 'purchase',
  /** Stars given to a bag halfway through it or once it is finished. */
  bagRating: 'bag_rating',
} as const;

export type TasteProfileSource = (typeof TASTE_PROFILE_SOURCES)[keyof typeof TASTE_PROFILE_SOURCES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const TASTE_PROFILE_SOURCE_VALUES = [
  TASTE_PROFILE_SOURCES.questionnaire,
  TASTE_PROFILE_SOURCES.calibrationBrew,
  TASTE_PROFILE_SOURCES.brewChat,
  TASTE_PROFILE_SOURCES.brewHistory,
  TASTE_PROFILE_SOURCES.manual,
  TASTE_PROFILE_SOURCES.purchase,
  TASTE_PROFILE_SOURCES.bagRating,
] as const;
