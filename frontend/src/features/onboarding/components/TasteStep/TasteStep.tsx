import type { JSX } from 'react';

import { Button, LoadingState, OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import { useTasteQuestionnaire } from '../../hooks/useTasteQuestionnaire';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import type { TasteQuestionOption } from '../../services/tasteQuestionTypes';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface TasteStepProps {
  readonly flow: OnboardingFlow;
}

/**
 * One question per screen.
 *
 * Tapping an answer is the whole interaction - no confirm button, because the
 * card the finger is already on is the confirmation. Going back re-opens the
 * previous question with the previous answer still selected, so changing your
 * mind costs one tap rather than a restart.
 */
export const TasteStep = ({ flow }: TasteStepProps): JSX.Element => {
  const { t } = useTranslation();
  const questionnaire = useTasteQuestionnaire(flow);

  return (
    <OnboardingStepLayout
      step={ONBOARDING_STEPS.taste}
      flow={flow}
      canGoBack={questionnaire.canGoBack}
      onBack={questionnaire.goBack}
    >
      <Text variant="headlineSmall">{t(questionnaire.question.promptKey)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(questionnaire.question.helpKey)}
      </Text>
      {questionnaire.question.options.map((option: TasteQuestionOption): JSX.Element => (
        <OptionCard
          key={option.id}
          label={t(option.labelKey)}
          note={option.noteKey === undefined ? undefined : t(option.noteKey)}
          selected={option.id === questionnaire.selectedOptionId}
          disabled={questionnaire.isSubmitting}
          onPress={(): void => {
            questionnaire.answer(option.id);
          }}
        />
      ))}
      {questionnaire.isSubmitting ? (
        <LoadingState label={t(TRANSLATION_KEYS.stateLoading)} />
      ) : null}
      {questionnaire.hasFailed ? (
        <Button
          label={t(TRANSLATION_KEYS.actionRetry)}
          variant="secondary"
          onPress={questionnaire.retry}
          fullWidth
        />
      ) : null}
    </OnboardingStepLayout>
  );
};
