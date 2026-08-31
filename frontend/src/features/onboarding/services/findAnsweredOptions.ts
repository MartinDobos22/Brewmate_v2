import type { TasteExperienceLevel } from '../constants/tasteExperienceLevels';

import { resolveLevelQuestions } from './resolveLevelQuestions';
import type { TasteQuestion, TasteQuestionOption } from './tasteQuestionTypes';

export interface AnsweredOption {
  readonly option: TasteQuestionOption;
  /** The weight of the question the option belongs to. */
  readonly weight: number;
}

const findOption = (
  question: TasteQuestion,
  optionId: string | undefined,
): TasteQuestionOption | undefined =>
  question.options.find((option: TasteQuestionOption): boolean => option.id === optionId);

/**
 * The options actually tapped, paired with how much their question counts.
 *
 * Read against the level's own questions rather than the whole catalogue, and
 * that narrowing is what makes a stored answer set safe to reuse. Somebody who
 * answered as a beginner and comes back as an expert has answers to questions
 * the expert set never asks, and folding those in would build a profile from
 * evidence the person was never shown.
 *
 * An answer naming an option that no longer exists is dropped rather than
 * guessed at: the questionnaire is versioned, and a stale answer from an older
 * version is not evidence about anything.
 */
export const findAnsweredOptions = (
  answers: Readonly<Record<string, string>>,
  level: TasteExperienceLevel,
): readonly AnsweredOption[] =>
  resolveLevelQuestions(level).flatMap((question: TasteQuestion): readonly AnsweredOption[] => {
    const option = findOption(question, answers[question.id]);

    return option === undefined ? [] : [{ option, weight: question.weight }];
  });
