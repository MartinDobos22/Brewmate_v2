import { TASTE_EXPERIENCE_LEVELS, type TasteExperienceLevel } from '../tasteExperienceLevels';

/** Who a question is written for, named so the question itself can say it. */
export type QuestionAudience =
  'everyone' | 'plainLanguage' | 'informed' | 'expertOnly' | 'beginnerOnly';

/**
 * The audiences a question can be written for.
 *
 * Named rather than spelled out at each question, so that "this is one of the
 * plain-language ones" is stated once and reads the same everywhere. The
 * middle level gets almost everything: somebody who brews regularly can answer
 * a direct question about body and still has an opinion about chocolate.
 */
export const QUESTION_LEVELS: Record<QuestionAudience, readonly TasteExperienceLevel[]> = {
  /** Everybody, at any level. What ruins a cup needs no vocabulary. */
  everyone: [
    TASTE_EXPERIENCE_LEVELS.beginner,
    TASTE_EXPERIENCE_LEVELS.regular,
    TASTE_EXPERIENCE_LEVELS.expert,
  ],
  /** Answerable without ever having tasted a deliberately brewed coffee. */
  plainLanguage: [TASTE_EXPERIENCE_LEVELS.beginner, TASTE_EXPERIENCE_LEVELS.regular],
  /** Needs the words for what a cup is doing, and an opinion about them. */
  informed: [TASTE_EXPERIENCE_LEVELS.regular, TASTE_EXPERIENCE_LEVELS.expert],
  /** Assumes origins, processes and extraction are already familiar ground. */
  expertOnly: [TASTE_EXPERIENCE_LEVELS.expert],
  /** Assumes nothing at all, and would be noise to anybody who brews. */
  beginnerOnly: [TASTE_EXPERIENCE_LEVELS.beginner],
};
