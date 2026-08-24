import { ANALYTICS_EVENT_NAMES, TASTE_PROFILE_SOURCES } from '@brewmate/shared';
import { useState } from 'react';

import { trackEvent } from '../../../lib/analytics';
import { useAddTasteProfileEvent } from '../../tasteProfile/hooks';
import { TASTE_QUESTIONS } from '../constants/tasteQuestions';
import { buildQuestionnairePayload } from '../services/buildQuestionnairePayload';
import { buildQuestionnaireSourceRef } from '../services/buildQuestionnaireSourceRef';
import { withAnswers } from '../services/onboardingState';
import type { TasteQuestion } from '../services/tasteQuestionTypes';

import type { OnboardingFlow } from './useOnboardingFlow';

const FIRST = 0;
const NEXT = 1;
const NOT_FOUND = -1;

type Answers = Readonly<Record<string, string>>;

export interface TasteQuestionnaire {
  readonly question: TasteQuestion;
  readonly index: number;
  readonly total: number;
  readonly selectedOptionId: string | null;
  readonly answer: (optionId: string) => void;
  readonly canGoBack: boolean;
  readonly goBack: () => void;
  readonly isSubmitting: boolean;
  readonly hasFailed: boolean;
  readonly retry: () => void;
}

/** Resuming lands on the first question nobody has answered yet. */
const firstUnansweredIndex = (answers: Answers): number => {
  const index = TASTE_QUESTIONS.findIndex(
    (question: TasteQuestion): boolean => answers[question.id] === undefined,
  );

  return index === NOT_FOUND ? FIRST : index;
};

/**
 * The questionnaire as one screen at a time.
 *
 * Each tap is written to the server before the next question appears, so
 * closing the app halfway through loses nothing. The taste event itself is
 * sent once, at the end, because ten separate events would let the last
 * question overwrite the first nine.
 */
export const useTasteQuestionnaire = (flow: OnboardingFlow): TasteQuestionnaire => {
  /**
   * The answers are held here and mirrored to the server, rather than read
   * back out of the cache: the write is optimistic, so the cached copy can
   * still be one tap behind when the next question is answered, and merging
   * into a stale copy would quietly drop the previous answer.
   */
  const [answers, setAnswers] = useState<Answers>((): Answers => flow.state.questionnaireAnswers);
  const [index, setIndex] = useState((): number => firstUnansweredIndex(answers));
  const submit = useAddTasteProfileEvent();
  const question = TASTE_QUESTIONS[index] ?? TASTE_QUESTIONS[FIRST];

  const send = (submitted: Answers): void => {
    submit.mutate(
      {
        source: TASTE_PROFILE_SOURCES.questionnaire,
        sourceRef: buildQuestionnaireSourceRef(submitted),
        payload: buildQuestionnairePayload(submitted),
      },
      {
        onSuccess: (): void => {
          /**
           * Counted when the event was accepted rather than when the tenth
           * card was tapped: a questionnaire that never reached the server is
           * one nobody answered, whatever it looked like on the phone.
           */
          trackEvent(ANALYTICS_EVENT_NAMES.questionnaireCompleted);
          flow.goNext();
        },
      },
    );
  };

  return {
    question,
    index,
    total: TASTE_QUESTIONS.length,
    selectedOptionId: answers[question.id] ?? null,
    isSubmitting: submit.isPending,
    hasFailed: submit.isError,
    canGoBack: index > FIRST || flow.canGoBack,
    retry: (): void => {
      send(answers);
    },

    answer: (optionId: string): void => {
      const updated: Answers = { ...answers, [question.id]: optionId };

      setAnswers(updated);
      flow.saveState(withAnswers(flow.state, updated));

      if (index + NEXT < TASTE_QUESTIONS.length) {
        setIndex(index + NEXT);

        return;
      }

      send(updated);
    },

    goBack: (): void => {
      if (index > FIRST) {
        setIndex(index - NEXT);

        return;
      }

      flow.goBack();
    },
  };
};
