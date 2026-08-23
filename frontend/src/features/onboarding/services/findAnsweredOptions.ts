import { TASTE_QUESTIONS } from '../constants/tasteQuestions';

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
 * An answer naming an option that no longer exists is dropped rather than
 * guessed at: the questionnaire is versioned, and a stale answer from an older
 * version is not evidence about anything.
 */
export const findAnsweredOptions = (
  answers: Readonly<Record<string, string>>,
): readonly AnsweredOption[] =>
  TASTE_QUESTIONS.flatMap((question: TasteQuestion): readonly AnsweredOption[] => {
    const option = findOption(question, answers[question.id]);

    return option === undefined ? [] : [{ option, weight: question.weight }];
  });
