import { ANALYTICS_EVENT_NAMES, TASTE_PROFILE_SOURCES } from '@brewmate/shared';
import { useState } from 'react';

import { trackEvent } from '../../../lib/analytics';
import { useAddTasteProfileEvent } from '../../tasteProfile/hooks';
import {
  isTasteExperienceLevel,
  type TasteExperienceLevel,
} from '../constants/tasteExperienceLevels';
import { buildQuestionnairePayload } from '../services/buildQuestionnairePayload';
import { buildQuestionnaireSourceRef } from '../services/buildQuestionnaireSourceRef';
import { withAnswers, withQuestionnaireLevel } from '../services/onboardingState';
import { resolveLevelQuestions } from '../services/resolveLevelQuestions';
import type { TasteQuestion } from '../services/tasteQuestionTypes';

import type { OnboardingFlow } from './useOnboardingFlow';

const FIRST = 0;
const NEXT = 1;
const NOT_FOUND = -1;
/** The level itself is a question, and the progress count has to include it. */
const LEVEL_STEP = 1;

type Answers = Readonly<Record<string, string>>;

export interface TasteQuestionnaire {
  /** Null while the level is still being chosen, which is question zero. */
  readonly question: TasteQuestion | null;
  readonly level: TasteExperienceLevel | null;
  readonly chooseLevel: (level: TasteExperienceLevel) => void;
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
const firstUnansweredIndex = (questions: readonly TasteQuestion[], answers: Answers): number => {
  const index = questions.findIndex(
    (question: TasteQuestion): boolean => answers[question.id] === undefined,
  );

  return index === NOT_FOUND ? FIRST : index;
};

const storedLevel = (flow: OnboardingFlow): TasteExperienceLevel | null => {
  const stored = flow.state.questionnaireLevel;

  return isTasteExperienceLevel(stored) ? stored : null;
};

/**
 * The questionnaire as one screen at a time.
 *
 * It opens by asking how much coffee vocabulary the person has, because that
 * decides which questions are worth asking them at all - and the answer is
 * saved before the first question appears, so a run resumed tomorrow asks the
 * same set rather than folding beginner answers into an expert's evidence.
 *
 * Each tap is written to the server before the next question appears, so
 * closing the app halfway through loses nothing. The taste event itself is
 * sent once, at the end, because a dozen separate events would let the last
 * question overwrite the ones before it simply by arriving last.
 */
export const useTasteQuestionnaire = (flow: OnboardingFlow): TasteQuestionnaire => {
  /**
   * The answers are held here and mirrored to the server, rather than read
   * back out of the cache: the write is optimistic, so the cached copy can
   * still be one tap behind when the next question is answered, and merging
   * into a stale copy would quietly drop the previous answer.
   */
  const [answers, setAnswers] = useState<Answers>((): Answers => flow.state.questionnaireAnswers);
  const [level, setLevel] = useState<TasteExperienceLevel | null>((): TasteExperienceLevel | null =>
    storedLevel(flow),
  );
  const questions = level === null ? [] : resolveLevelQuestions(level);
  const [index, setIndex] = useState((): number => firstUnansweredIndex(questions, answers));
  const submit = useAddTasteProfileEvent();
  const question = level === null ? null : (questions[index] ?? questions[FIRST] ?? null);

  const send = (submitted: Answers, at: TasteExperienceLevel): void => {
    submit.mutate(
      {
        source: TASTE_PROFILE_SOURCES.questionnaire,
        sourceRef: buildQuestionnaireSourceRef(submitted, at),
        payload: buildQuestionnairePayload(submitted, at),
      },
      {
        onSuccess: (): void => {
          /**
           * Counted when the event was accepted rather than when the last card
           * was tapped: a questionnaire that never reached the server is one
           * nobody answered, whatever it looked like on the phone.
           */
          trackEvent(ANALYTICS_EVENT_NAMES.questionnaireCompleted);
          flow.goNext();
        },
      },
    );
  };

  return {
    question,
    level,
    index: level === null ? FIRST : index + LEVEL_STEP,
    total: questions.length + LEVEL_STEP,
    selectedOptionId: question === null ? null : (answers[question.id] ?? null),
    isSubmitting: submit.isPending,
    hasFailed: submit.isError,
    canGoBack: level !== null || flow.canGoBack,
    retry: (): void => {
      if (level !== null) {
        send(answers, level);
      }
    },

    /**
     * Choosing a level starts the questionnaire over rather than carrying the
     * previous answers across. The same option id can exist in two levels, and
     * an answer kept from a set the person is no longer being shown is
     * evidence about a question they were never asked.
     */
    chooseLevel: (chosen: TasteExperienceLevel): void => {
      const cleared: Answers = {};

      setLevel(chosen);
      setAnswers(cleared);
      setIndex(FIRST);
      flow.saveState(withQuestionnaireLevel(withAnswers(flow.state, cleared), chosen));
    },

    answer: (optionId: string): void => {
      if (question === null || level === null) {
        return;
      }

      const updated: Answers = { ...answers, [question.id]: optionId };

      setAnswers(updated);
      flow.saveState(withAnswers(flow.state, updated));

      if (index + NEXT < questions.length) {
        setIndex(index + NEXT);

        return;
      }

      send(updated, level);
    },

    goBack: (): void => {
      if (index > FIRST) {
        setIndex(index - NEXT);

        return;
      }

      /** Back from the first question re-opens the level, not the step before. */
      if (level !== null) {
        setLevel(null);

        return;
      }

      flow.goBack();
    },
  };
};
