import { QUESTIONNAIRE_VIEWS, type QuestionnaireView } from '../constants/questionnaireViews';

/** The level is a question like any other, and the first one that gets asked. */
const LEVEL_QUESTION = 1;
const AFTER_LEVEL = 2;

export interface QuestionnaireProgressInput {
  readonly view: QuestionnaireView;
  /** Where in this level's own questions the screen is, counting from zero. */
  readonly index: number;
  readonly asked: number;
}

export interface QuestionnaireProgress {
  /** Counting from one, so it reads the way "otázka 3 z 8" does. */
  readonly current: number;
  readonly total: number;
}

/**
 * How far through the questions somebody is, where that can honestly be said.
 *
 * The questionnaire is one step of the flow and eight or more screens inside
 * it, and only the step was ever counted - so the whole questionnaire read
 * "krok 1 z 7" from the first question to the last, which is the one point at
 * which somebody decides they are getting nowhere and leaves.
 *
 * The level counts as the first question rather than as something before them.
 * It is answered by tapping a card exactly like the rest, it decides more about
 * the profile than any single question after it, and a count that began at the
 * second screen would say "otázka 1 z 8" to somebody who had already answered
 * one.
 *
 * Null on the level screen itself, because how many questions follow is
 * precisely what is being decided there - a beginner is asked fewer than an
 * expert - and a total invented before the answer would be a promise the next
 * screen breaks. Null on the summary, for the reason the shared progress bar
 * draws nothing at zero: a list of what was answered is showing what happened,
 * not a step left to get through.
 */
export const readQuestionnaireProgress = ({
  view,
  index,
  asked,
}: QuestionnaireProgressInput): QuestionnaireProgress | null =>
  view === QUESTIONNAIRE_VIEWS.question
    ? { current: index + AFTER_LEVEL, total: asked + LEVEL_QUESTION }
    : null;
