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
import {
  readQuestionnaireProgress,
  type QuestionnaireProgress,
} from '../services/questionnaireProgress';
import { resolveLevelQuestions } from '../services/resolveLevelQuestions';
import type { TasteQuestion } from '../services/tasteQuestionTypes';

import type { OnboardingFlow } from './useOnboardingFlow';

const FIRST = 0;
const NEXT = 1;
const NOT_FOUND = -1;

type Answers = Readonly<Record<string, string>>;

export interface TasteQuestionnaire {
  /** Null while the level is still being chosen, and once the answers are in. */
  readonly question: TasteQuestion | null;
  /** True on question zero: which set of questions this person gets asked. */
  readonly isPickingLevel: boolean;
  readonly level: TasteExperienceLevel | null;
  /** The level the stored answers belong to, which the picker shows as chosen. */
  readonly previousLevel: TasteExperienceLevel | null;
  readonly chooseLevel: (level: TasteExperienceLevel) => void;
  /**
   * Where in the questionnaire this screen is, the level counted as its first,
   * or null on the screens where there is nothing honest to count.
   */
  readonly progress: QuestionnaireProgress | null;
  readonly selectedOptionId: string | null;
  readonly answer: (optionId: string) => void;
  readonly canGoBack: boolean;
  readonly goBack: () => void;
  readonly isSubmitting: boolean;
  readonly hasFailed: boolean;
  readonly retry: () => void;
  /** True once the profile has actually been taught what was answered. */
  readonly isSaved: boolean;
  /** Leaves the questionnaire, which is a tap rather than something automatic. */
  readonly finish: () => void;
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
 * Which level the screen opens on, which is not always the stored one.
 *
 * Inside the flow the stored level is a resume point: somebody who answered
 * three questions yesterday is carrying on with the same set today, and asking
 * again would throw those three away. Reopened on its own from the profile or
 * the home screen it is not a resume at all - "vyplniť dotazník znova" is
 * somebody making a fresh statement about themselves, and which set of
 * questions that statement is made against is its first question. Skipping it
 * left the level answered once, on the first run, with no way back to it.
 */
const openingLevel = (flow: OnboardingFlow): TasteExperienceLevel | null =>
  flow.isSingleStep ? null : storedLevel(flow);

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
 * question overwrite the ones before it simply by arriving last - and the
 * screen says so when it lands, rather than sliding on to the next step as if
 * nothing had been asked.
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
    openingLevel(flow),
  );
  const [isSaved, setIsSaved] = useState(false);
  const questions = level === null ? [] : resolveLevelQuestions(level);
  const [index, setIndex] = useState((): number => firstUnansweredIndex(questions, answers));
  const submit = useAddTasteProfileEvent();
  const question =
    level === null || isSaved ? null : (questions[index] ?? questions[FIRST] ?? null);

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
          setIsSaved(true);
        },
      },
    );
  };

  return {
    question,
    level,
    isSaved,
    isPickingLevel: level === null && !isSaved,
    previousLevel: storedLevel(flow),
    finish: flow.goNext,
    progress: readQuestionnaireProgress({ level, index, asked: questions.length, isSaved }),
    selectedOptionId: question === null ? null : (answers[question.id] ?? null),
    isSubmitting: submit.isPending,
    hasFailed: submit.isError,
    canGoBack: !isSaved && (level !== null || flow.canGoBack),
    retry: (): void => {
      if (level !== null) {
        send(answers, level);
      }
    },

    /**
     * Choosing a different level starts the questionnaire over rather than
     * carrying the previous answers across. The same option id can exist in
     * two levels, and an answer kept from a set the person is no longer being
     * shown is evidence about a question they were never asked. Re-picking the
     * level somebody already had is not that: those answers belong to exactly
     * this set of questions, so they stay, filled in, to be confirmed or
     * changed one tap at a time.
     */
    chooseLevel: (chosen: TasteExperienceLevel): void => {
      /**
       * Read off the flow rather than out of this hook. A step opened on its
       * own is on screen before `/me` has answered, so the copy held here can
       * still be the empty one it started with - and writing that back would
       * throw away the answers somebody came here to change.
       */
      const kept: Answers = chosen === storedLevel(flow) ? flow.state.questionnaireAnswers : {};

      setLevel(chosen);
      setAnswers(kept);
      setIndex(FIRST);
      flow.saveState(withQuestionnaireLevel(withAnswers(flow.state, kept), chosen));
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
