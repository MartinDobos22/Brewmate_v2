import type { OnboardingState } from '@brewmate/shared';

import { QUESTIONNAIRE_VIEWS, type QuestionnaireView } from '../constants/questionnaireViews';
import {
  isTasteExperienceLevel,
  type TasteExperienceLevel,
} from '../constants/tasteExperienceLevels';

import type { TasteQuestion } from './tasteQuestionTypes';

const FIRST = 0;
const NOT_FOUND = -1;
const NOTHING = 0;

type Answers = Readonly<Record<string, string>>;

/** The level the stored answers belong to, or nothing if it predates them. */
export const readStoredLevel = (state: OnboardingState): TasteExperienceLevel | null => {
  const stored = state.questionnaireLevel;

  return isTasteExperienceLevel(stored) ? stored : null;
};

/** Resuming lands on the first question nobody has answered yet. */
export const firstUnansweredIndex = (
  questions: readonly TasteQuestion[],
  answers: Answers,
): number => {
  const index = questions.findIndex(
    (question: TasteQuestion): boolean => answers[question.id] === undefined,
  );

  return index === NOT_FOUND ? FIRST : index;
};

/**
 * Which of the three screens the taste step opens on.
 *
 * A step reopened on its own by somebody who has answered before opens on the
 * summary, read-only. That is the whole point of the summary existing: the way
 * back into the questionnaire is also the way to overwrite what it learned,
 * and dropping straight onto a screen of tappable cards means one stray tap
 * rewrites an answer nobody meant to revisit - which then re-teaches the
 * profile, silently, on the strength of a misplaced thumb.
 *
 * Inside the flow, and for anybody who has answered nothing yet, there is
 * nothing to review and the questionnaire simply carries on where it stopped.
 */
export const readOpeningView = (
  state: OnboardingState,
  isSingleStep: boolean,
): QuestionnaireView => {
  if (readStoredLevel(state) === null) {
    return QUESTIONNAIRE_VIEWS.level;
  }

  return isSingleStep && Object.keys(state.questionnaireAnswers).length > NOTHING
    ? QUESTIONNAIRE_VIEWS.summary
    : QUESTIONNAIRE_VIEWS.question;
};
