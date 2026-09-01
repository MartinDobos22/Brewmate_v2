import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import {
  TASTE_EXPERIENCE_LABEL_KEYS,
  type TasteExperienceLevel,
} from '../constants/tasteExperienceLevels';

import { resolveLevelQuestions } from './resolveLevelQuestions';
import type { TasteQuestion, TasteQuestionOption } from './tasteQuestionTypes';

export interface AnswerSummaryRow {
  /** Stable across a re-render, so the list does not remount its rows. */
  readonly id: string;
  readonly promptKey: TranslationKey;
  /** Null where the question has not been answered yet. */
  readonly answerKey: TranslationKey | null;
  /**
   * Which question the row opens for editing, or null for the level.
   *
   * The level is question one but it is not one of this level's questions -
   * it decides what they are - so it is opened by its own screen rather than
   * by an index into a list it sits outside of.
   */
  readonly questionIndex: number | null;
}

const findOption = (
  question: TasteQuestion,
  optionId: string | undefined,
): TasteQuestionOption | undefined =>
  question.options.find((option: TasteQuestionOption): boolean => option.id === optionId);

/** The level's own row, which is the first thing anybody answered. */
const levelRow = (level: TasteExperienceLevel): AnswerSummaryRow => ({
  id: level,
  promptKey: TRANSLATION_KEYS.tqLevelPrompt,
  answerKey: TASTE_EXPERIENCE_LABEL_KEYS[level],
  questionIndex: null,
});

/**
 * What somebody answered, in the order they were asked.
 *
 * This is the questionnaire held still. Filling it in is a screen at a time
 * with no way back to what came before, which is right while answering and
 * useless afterwards: "what did I actually say?" is a question anybody asks
 * about a profile that is now recommending coffee to them, and the only
 * previous answer to it was to tap through the whole thing again - which
 * changed the answers rather than showing them.
 *
 * A question with no answer is still a row. Somebody who left halfway through
 * is owed the sight of where they stopped, and a list that silently omitted
 * the gaps would be a list claiming the questionnaire was finished.
 */
export const buildAnswerSummary = (
  level: TasteExperienceLevel,
  answers: Readonly<Record<string, string>>,
): readonly AnswerSummaryRow[] => [
  levelRow(level),
  ...resolveLevelQuestions(level).map(
    (question: TasteQuestion, index: number): AnswerSummaryRow => ({
      id: question.id,
      promptKey: question.promptKey,
      answerKey: findOption(question, answers[question.id])?.labelKey ?? null,
      questionIndex: index,
    }),
  ),
];
