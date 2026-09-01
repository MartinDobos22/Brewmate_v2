import { TRANSLATION_KEYS, type TranslationKey } from '../../../../i18n';
import type { TasteQuestionnaire } from '../../hooks/tasteQuestionnaireTypes';
import type { AnswerSummaryRow } from '../../services/buildAnswerSummary';

export interface SummaryHeadings {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
}

/**
 * A questionnaire somebody walked away from halfway is not a saved one.
 *
 * It matters because completing the last question is what sends the answers:
 * a stored set with a hole in it was written to the account but never taught
 * to the profile, and a summary that called it "uložené" would be claiming
 * credit for evidence nobody has.
 */
const isComplete = (rows: readonly AnswerSummaryRow[]): boolean =>
  rows.every((row: AnswerSummaryRow): boolean => row.answerKey !== null);

/**
 * What the summary says it is, which is five different sentences.
 *
 * The state of this screen is the whole feature - somebody has to be able to
 * tell, without reading the buttons, whether what they are looking at has been
 * saved, is being changed, is waiting to be saved, or was never finished.
 * Deciding it here rather than in the component keeps the cases side by side,
 * where a sixth one cannot quietly turn into an unlabelled default.
 */
export const readSummaryHeadingKeys = (questionnaire: TasteQuestionnaire): SummaryHeadings => {
  if (questionnaire.isEditing) {
    return {
      titleKey: TRANSLATION_KEYS.tqSummaryEditTitle,
      bodyKey: TRANSLATION_KEYS.tqSummaryEditBody,
    };
  }

  /** Changed and not sent: the profile still says what it said before. */
  if (questionnaire.isDirty) {
    return {
      titleKey: TRANSLATION_KEYS.tqSummaryTitle,
      bodyKey: TRANSLATION_KEYS.tqSummaryUnsaved,
    };
  }

  if (questionnaire.isSaved) {
    return { titleKey: TRANSLATION_KEYS.tqSavedTitle, bodyKey: TRANSLATION_KEYS.tqSavedBody };
  }

  return isComplete(questionnaire.rows)
    ? { titleKey: TRANSLATION_KEYS.tqSummaryTitle, bodyKey: TRANSLATION_KEYS.tqSummaryBody }
    : {
        titleKey: TRANSLATION_KEYS.tqSummaryUnfinishedTitle,
        bodyKey: TRANSLATION_KEYS.tqSummaryUnfinishedBody,
      };
};
