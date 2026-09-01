import type { QuestionnaireView } from '../constants/questionnaireViews';
import type { TasteExperienceLevel } from '../constants/tasteExperienceLevels';
import type { AnswerSummaryRow } from '../services/buildAnswerSummary';
import type { QuestionnaireProgress } from '../services/questionnaireProgress';
import type { TasteQuestion } from '../services/tasteQuestionTypes';

/**
 * Everything the taste step is allowed to know about the questionnaire.
 *
 * Its own file because four components read it - the step, the summary, the
 * summary's actions and the sentence above them - and because the hook below
 * it is a state machine rather than a description: what the screens are
 * promised is worth being able to read on its own.
 */
export interface TasteQuestionnaire {
  readonly view: QuestionnaireView;
  /** The question on screen, or null on the level and summary screens. */
  readonly question: TasteQuestion | null;
  /** The level the stored answers belong to, which the picker shows as chosen. */
  readonly previousLevel: TasteExperienceLevel | null;
  readonly chooseLevel: (level: TasteExperienceLevel) => void;
  /** Where in the questionnaire this screen is, or null where nothing counts. */
  readonly progress: QuestionnaireProgress | null;
  readonly selectedOptionId: string | null;
  readonly answer: (optionId: string) => void;
  readonly canGoBack: boolean;
  readonly goBack: () => void;
  readonly isSubmitting: boolean;
  readonly hasFailed: boolean;
  /** Every question and what was answered, for the summary to print. */
  readonly rows: readonly AnswerSummaryRow[];
  /** True while the summary may be tapped: without it, nothing there changes. */
  readonly isEditing: boolean;
  readonly edit: () => void;
  /** Opens one row for editing - `null` is the level, which has its own screen. */
  readonly openRow: (questionIndex: number | null) => void;
  /** True once these exact answers have been sent and accepted. */
  readonly isSaved: boolean;
  /** True while something has been changed that the profile has not been told. */
  readonly isDirty: boolean;
  readonly save: () => void;
  /** Leaves the questionnaire, which is a tap rather than something automatic. */
  readonly finish: () => void;
}
