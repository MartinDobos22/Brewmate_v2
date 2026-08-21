/**
 * Where a taste profile event came from. The source decides how much the
 * event is trusted, so it is a closed set the reducer branches on.
 */
export const TASTE_PROFILE_SOURCES = {
  questionnaire: 'questionnaire',
  calibrationBrew: 'calibration_brew',
  brewChat: 'brew_chat',
  manual: 'manual',
} as const;

export type TasteProfileSource =
  (typeof TASTE_PROFILE_SOURCES)[keyof typeof TASTE_PROFILE_SOURCES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const TASTE_PROFILE_SOURCE_VALUES = [
  TASTE_PROFILE_SOURCES.questionnaire,
  TASTE_PROFILE_SOURCES.calibrationBrew,
  TASTE_PROFILE_SOURCES.brewChat,
  TASTE_PROFILE_SOURCES.manual,
] as const;
