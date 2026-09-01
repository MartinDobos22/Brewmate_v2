import { ANALYTICS_EVENT_NAMES, TASTE_PROFILE_SOURCES } from '@brewmate/shared';
import { useState } from 'react';

import { trackEvent } from '../../../lib/analytics';
import { useAddTasteProfileEvent } from '../../tasteProfile/hooks';
import { QUESTIONNAIRE_VIEWS, type QuestionnaireView } from '../constants/questionnaireViews';
import type { TasteExperienceLevel } from '../constants/tasteExperienceLevels';
import { buildAnswerSummary } from '../services/buildAnswerSummary';
import { buildQuestionnairePayload } from '../services/buildQuestionnairePayload';
import { buildQuestionnaireSourceRef } from '../services/buildQuestionnaireSourceRef';
import { withAnswers, withQuestionnaireLevel } from '../services/onboardingState';
import {
  firstUnansweredIndex,
  readOpeningView,
  readStoredLevel,
} from '../services/questionnaireStart';
import { readQuestionnaireProgress } from '../services/questionnaireProgress';
import { resolveLevelQuestions } from '../services/resolveLevelQuestions';

import type { TasteQuestionnaire } from './tasteQuestionnaireTypes';
import type { OnboardingFlow } from './useOnboardingFlow';

const FIRST = 0;
const NEXT = 1;

type Answers = Readonly<Record<string, string>>;

/**
 * The questionnaire as one screen at a time, and then as one list.
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
 *
 * What happens after that is the part this hook exists for. The answers land
 * on a summary that says they were saved and cannot be changed by touching it;
 * editing is a button, one row at a time, and the profile is not told anything
 * new until somebody presses save.
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
    readStoredLevel(flow.state),
  );
  const [view, setView] = useState<QuestionnaireView>((): QuestionnaireView =>
    readOpeningView(flow.state, flow.isSingleStep),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const questions = level === null ? [] : resolveLevelQuestions(level);
  const [index, setIndex] = useState((): number => firstUnansweredIndex(questions, answers));
  const submit = useAddTasteProfileEvent();
  const question =
    view === QUESTIONNAIRE_VIEWS.question ? (questions[index] ?? questions[FIRST] ?? null) : null;

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
          setIsDirty(false);
          setIsEditing(false);
          setView(QUESTIONNAIRE_VIEWS.summary);
        },
      },
    );
  };

  return {
    view,
    question,
    isEditing,
    isSaved,
    isDirty,
    finish: flow.goNext,
    previousLevel: readStoredLevel(flow.state),
    rows: level === null ? [] : buildAnswerSummary(level, answers),
    progress: readQuestionnaireProgress({ view, index, asked: questions.length }),
    selectedOptionId: question === null ? null : (answers[question.id] ?? null),
    isSubmitting: submit.isPending,
    hasFailed: submit.isError,
    canGoBack: view !== QUESTIONNAIRE_VIEWS.summary || isEditing,

    edit: (): void => {
      setIsEditing(true);
    },

    openRow: (questionIndex: number | null): void => {
      if (questionIndex === null) {
        setView(QUESTIONNAIRE_VIEWS.level);

        return;
      }

      setIndex(questionIndex);
      setView(QUESTIONNAIRE_VIEWS.question);
    },

    save: (): void => {
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
     * this set of questions, so they stay and the summary comes straight back.
     */
    chooseLevel: (chosen: TasteExperienceLevel): void => {
      /**
       * Read off the flow rather than out of this hook. A step opened on its
       * own is on screen before `/me` has answered, so the copy held here can
       * still be the empty one it started with - and writing that back would
       * throw away the answers somebody came here to change.
       */
      const isSame = chosen === readStoredLevel(flow.state);
      const kept: Answers = isSame ? flow.state.questionnaireAnswers : {};

      setLevel(chosen);
      setAnswers(kept);
      setIndex(FIRST);
      setIsDirty(!isSame);
      setView(isSame && isEditing ? QUESTIONNAIRE_VIEWS.summary : QUESTIONNAIRE_VIEWS.question);
      setIsEditing(isSame && isEditing);
      flow.saveState(withQuestionnaireLevel(withAnswers(flow.state, kept), chosen));
    },

    /**
     * One tap answers the question. Where it goes afterwards is the difference
     * between filling the questionnaire in and correcting it: the first run
     * walks forward and submits itself at the end, while a correction returns
     * to the list it was opened from and waits to be saved.
     */
    answer: (optionId: string): void => {
      if (question === null || level === null) {
        return;
      }

      const updated: Answers = { ...answers, [question.id]: optionId };

      setAnswers(updated);
      setIsDirty(true);
      flow.saveState(withAnswers(flow.state, updated));

      if (isEditing) {
        setView(QUESTIONNAIRE_VIEWS.summary);

        return;
      }

      if (index + NEXT < questions.length) {
        setIndex(index + NEXT);

        return;
      }

      send(updated, level);
    },

    /**
     * Back is the way out of whatever is on screen, in the order they nest:
     * out of editing, out of a question opened from the summary, out of a
     * question into the one before it, out of the first question into the
     * level, and only from the level out of the step itself.
     */
    goBack: (): void => {
      if (view === QUESTIONNAIRE_VIEWS.summary) {
        setIsEditing(false);
      } else if (isEditing || isSaved) {
        setView(QUESTIONNAIRE_VIEWS.summary);
      } else if (view === QUESTIONNAIRE_VIEWS.level) {
        flow.goBack();
      } else if (index > FIRST) {
        setIndex(index - NEXT);
      } else {
        setView(QUESTIONNAIRE_VIEWS.level);
      }
    },
  };
};
