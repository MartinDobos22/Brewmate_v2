import { TASTE_PROFILE_SOURCES } from '@brewmate/shared';
import type { TasteProfileSource } from '@brewmate/shared';

/**
 * How far each kind of evidence is trusted.
 *
 * A questionnaire is somebody telling us directly, a calibration brew is
 * somebody tasting deliberately, a remark in chat is an aside, and a manual
 * edit is the user overruling us - which they are entitled to do outright.
 */
export const SOURCE_TRUST: Record<TasteProfileSource, number> = {
  [TASTE_PROFILE_SOURCES.questionnaire]: 0.6,
  [TASTE_PROFILE_SOURCES.calibrationBrew]: 0.5,
  [TASTE_PROFILE_SOURCES.brewChat]: 0.25,
  [TASTE_PROFILE_SOURCES.manual]: 1,
};

/** Sources whose events represent an actual cup of coffee. */
export const BREW_SOURCES: readonly TasteProfileSource[] = [
  TASTE_PROFILE_SOURCES.calibrationBrew,
  TASTE_PROFILE_SOURCES.brewChat,
];

/** An event that does not say how much it counts, counts fully. */
export const DEFAULT_EVENT_WEIGHT = 1;

/**
 * How much accumulated evidence amounts to a profile Brewmate is fully
 * confident in. Reached by, say, a questionnaire plus a handful of deliberate
 * calibration brews.
 */
export const FULL_CONFIDENCE_EVIDENCE = 5;

export const MIN_WEIGHT = 0;
export const MAX_WEIGHT = 1;
