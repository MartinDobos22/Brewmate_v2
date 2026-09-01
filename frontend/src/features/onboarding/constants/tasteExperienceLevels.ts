import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * How much coffee vocabulary the person answering has.
 *
 * One questionnaire cannot serve both ends of this. Asked to rate the acidity
 * they want, somebody who has only ever drunk coffee from a capsule machine
 * either guesses or picks the middle - and a guess folded into a profile is
 * worse than a question never asked, because the profile then acts on it.
 * Asked instead which chocolate they prefer, a competition barista answers
 * accurately and tells us almost nothing: they can say what they want from a
 * cup directly, and routing that through a proxy throws away the precision.
 *
 * So the questions are chosen for the answerer rather than watered down for
 * everybody. The five axes, the fold and the stored profile are identical
 * across all three - only the evidence differs, which is the one thing that
 * should.
 */
export const TASTE_EXPERIENCE_LEVELS = {
  beginner: 'beginner',
  regular: 'regular',
  expert: 'expert',
} as const;

export type TasteExperienceLevel =
  (typeof TASTE_EXPERIENCE_LEVELS)[keyof typeof TASTE_EXPERIENCE_LEVELS];

export const TASTE_EXPERIENCE_LEVEL_ORDER: readonly TasteExperienceLevel[] = [
  TASTE_EXPERIENCE_LEVELS.beginner,
  TASTE_EXPERIENCE_LEVELS.regular,
  TASTE_EXPERIENCE_LEVELS.expert,
];

export const TASTE_EXPERIENCE_LABEL_KEYS: Record<TasteExperienceLevel, TranslationKey> = {
  [TASTE_EXPERIENCE_LEVELS.beginner]: TRANSLATION_KEYS.tqLevelBeginner,
  [TASTE_EXPERIENCE_LEVELS.regular]: TRANSLATION_KEYS.tqLevelRegular,
  [TASTE_EXPERIENCE_LEVELS.expert]: TRANSLATION_KEYS.tqLevelExpert,
};

export const TASTE_EXPERIENCE_NOTE_KEYS: Record<TasteExperienceLevel, TranslationKey> = {
  [TASTE_EXPERIENCE_LEVELS.beginner]: TRANSLATION_KEYS.tqLevelBeginnerNote,
  [TASTE_EXPERIENCE_LEVELS.regular]: TRANSLATION_KEYS.tqLevelRegularNote,
  [TASTE_EXPERIENCE_LEVELS.expert]: TRANSLATION_KEYS.tqLevelExpertNote,
};

/**
 * How far a whole questionnaire is trusted, by the level it was answered at.
 *
 * This scales confidence, never the values themselves: what somebody said is
 * what the profile records whichever level they picked, and the level only
 * decides how much the app is entitled to claim it knows them afterwards. A
 * beginner's answers are mostly inferences from tea and chocolate, and an
 * inference is real evidence that is worth slightly less than a direct
 * statement of the same thing - not evidence to be argued with.
 */
export const TASTE_EXPERIENCE_TRUST: Record<TasteExperienceLevel, number> = {
  [TASTE_EXPERIENCE_LEVELS.beginner]: 0.75,
  [TASTE_EXPERIENCE_LEVELS.regular]: 0.9,
  [TASTE_EXPERIENCE_LEVELS.expert]: 1,
};

/** The level a stored answer set belongs to, or nothing if it predates them. */
export const isTasteExperienceLevel = (value: string | null): value is TasteExperienceLevel =>
  value !== null &&
  Object.values(TASTE_EXPERIENCE_LEVELS).some((level: string): boolean => level === value);
