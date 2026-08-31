import { TASTE_QUESTIONS } from '../constants/tasteQuestions';
import type { TasteExperienceLevel } from '../constants/tasteExperienceLevels';

import type { TasteQuestion } from './tasteQuestionTypes';

/**
 * The questions one person actually gets asked.
 *
 * A filter over the single catalogue rather than three hand-kept lists, in the
 * catalogue's own order - so the alternation between a direct question and an
 * easy one survives whichever level is chosen, instead of a beginner being
 * handed the four plain-language questions in a block and an expert the four
 * technical ones.
 *
 * How many questions a level ends up with is a consequence rather than a
 * target. A beginner is asked fewer because there are fewer things they can
 * answer without guessing, and a guess folded into a profile is worse than a
 * question never asked - the profile then acts on it.
 */
export const resolveLevelQuestions = (level: TasteExperienceLevel): readonly TasteQuestion[] =>
  TASTE_QUESTIONS.filter((question: TasteQuestion): boolean => question.levels.includes(level));
