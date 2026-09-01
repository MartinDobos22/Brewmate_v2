import type { JSX } from 'react';

import { Button } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import type { TasteQuestionnaire } from '../../hooks/tasteQuestionnaireTypes';

export interface TasteSummaryActionsProps {
  readonly questionnaire: TasteQuestionnaire;
  readonly isSingleStep: boolean;
}

/**
 * The one saturated button on the summary, and what it does depends on state.
 *
 * While editing it is the save, and it is available whether or not anything
 * was changed. Disabling it would strand two people: somebody who opened the
 * list to check something and now wants to confirm it, and somebody whose
 * questionnaire was never finished and has nothing to change yet. Saving the
 * same answers twice is harmless by design - the submission is fingerprinted,
 * so the API answers with the event it already holds rather than counting the
 * evidence again.
 *
 * Otherwise it carries the flow on, and there is nothing to press at all on a
 * step opened by itself - that screen is finished, and "Hotovo" in the corner
 * is how somebody leaves it.
 */
export const TasteSummaryActions = ({
  questionnaire,
  isSingleStep,
}: TasteSummaryActionsProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (questionnaire.isEditing) {
    return (
      <Button
        label={t(TRANSLATION_KEYS.tqSaveAnswers)}
        onPress={questionnaire.save}
        loading={questionnaire.isSubmitting}
        fullWidth
      />
    );
  }

  return isSingleStep ? null : (
    <Button
      label={t(TRANSLATION_KEYS.onboardingContinue)}
      onPress={questionnaire.finish}
      fullWidth
    />
  );
};
