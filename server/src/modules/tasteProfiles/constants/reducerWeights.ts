import { TASTE_PROFILE_SOURCES } from '@brewmate/shared';
import type { TasteProfileSource } from '@brewmate/shared';

/**
 * How far each kind of evidence is trusted.
 *
 * A questionnaire is somebody telling us directly, a calibration brew is
 * somebody tasting deliberately, a remark in chat is an aside, and a manual
 * edit is the user overruling us - which they are entitled to do outright.
 *
 * `brew_history` sits between the aside and the overrule, and that placement
 * is the whole argument about it. The evidence is behavioural - what somebody
 * actually reached for over weeks - which is worth more than a remark about
 * one cup. But it is still a conclusion drawn *about* them rather than
 * something they said, and it only ever reaches the trail because they read it
 * and agreed. Trusting it as far as the sliders would let a habit outrank a
 * preference, which is the wrong way round: people buy what the shop had.
 */
export const SOURCE_TRUST: Record<TasteProfileSource, number> = {
  [TASTE_PROFILE_SOURCES.questionnaire]: 0.6,
  [TASTE_PROFILE_SOURCES.calibrationBrew]: 0.5,
  [TASTE_PROFILE_SOURCES.brewChat]: 0.25,
  [TASTE_PROFILE_SOURCES.brewHistory]: 0.7,
  [TASTE_PROFILE_SOURCES.manual]: 1,
};

/**
 * Sources whose events represent an actual cup of coffee.
 *
 * `brew_history` is not one of them, however many cups it was drawn from. It
 * is one conclusion about a stretch of brewing, and counting it as a brew
 * would inflate the number the profile screen prints beside its confidence -
 * the one figure whose job is to say how much of this the app has tasted.
 */
export const BREW_SOURCES: readonly TasteProfileSource[] = [
  TASTE_PROFILE_SOURCES.calibrationBrew,
  TASTE_PROFILE_SOURCES.brewChat,
];

/** An event that does not say how much it counts, counts fully. */
export const DEFAULT_EVENT_WEIGHT = 1;

/**
 * An event that does not distinguish between the axes it names speaks about
 * all of them equally. Only the questionnaire currently says otherwise, and it
 * says so because it can measure whether its own answers agreed.
 */
export const DEFAULT_AXIS_WEIGHT = 1;

/** Nothing heard yet - the state the adopt-outright rule keys off. */
export const NO_EVIDENCE = 0;

/**
 * How much accumulated evidence amounts to a profile Brewmate is fully
 * confident in. Reached by, say, a questionnaire plus a handful of deliberate
 * calibration brews.
 */
export const FULL_CONFIDENCE_EVIDENCE = 5;

/**
 * How much evidence about one axis amounts to knowing that axis.
 *
 * Lower than the whole-profile figure, and not because an axis is easier to
 * learn. A profile is only fully known once every part of it is, so the two
 * ceilings measure different things: this one is reached by a questionnaire
 * that asked about the axis plus a few cups that mentioned it, which is
 * genuinely as much as anybody ever says about their own bitterness.
 */
export const FULL_AXIS_EVIDENCE = 3;

export const MIN_WEIGHT = 0;
export const MAX_WEIGHT = 1;
