import type { JSX } from 'react';

import { LoadingState, OptionCard, PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import { useTasteQuestionnaire } from '../../hooks/useTasteQuestionnaire';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import type { TasteQuestionOption } from '../../services/tasteQuestionTypes';
import { OnboardingStepLayout } from '../OnboardingStepLayout';
import { TasteLevelPicker } from '../TasteLevelPicker';
import { TasteSavedPanel } from '../TasteSavedPanel';

export interface TasteStepProps {
  readonly flow: OnboardingFlow;
}

/**
 * One question per screen, the first of which is which questions to ask.
 *
 * Tapping an answer is the whole interaction - no confirm button, because the
 * card the finger is already on is the confirmation. Going back re-opens the
 * previous question with the previous answer still selected, so changing your
 * mind costs one tap rather than a restart; from the first question it re-opens
 * the level, which is the only way to change your mind about that too.
 *
 * The count above the question is the questionnaire's own, not the flow's. As
 * one of seven steps this screen said "krok 1 z 7" from the first question to
 * the last, so the longest stretch of the whole product looked like a screen
 * that had stopped moving.
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
      note={questionnaire.progress ?? undefined}
    >
      {questionnaire.isSaved ? (
        <TasteSavedPanel isSingleStep={flow.isSingleStep} onContinue={questionnaire.finish} />
      ) : null}
      {questionnaire.isPickingLevel ? (
        <TasteLevelPicker
          selected={questionnaire.previousLevel}
          onChoose={questionnaire.chooseLevel}
        />
      ) : null}
      {questionnaire.question === null ? null : (
        <>
          <Text variant="displayTitle">{t(questionnaire.question.promptKey)}</Text>
          <Text variant="bodyText" tone="muted">
            {t(questionnaire.question.helpKey)}
          </Text>
          {questionnaire.question.options.map((option: TasteQuestionOption): JSX.Element => (
            <OptionCard
              key={option.id}
              label={t(option.labelKey)}
              icon={option.icon}
              note={option.noteKey === undefined ? undefined : t(option.noteKey)}
              selected={option.id === questionnaire.selectedOptionId}
              disabled={questionnaire.isSubmitting}
              onPress={(): void => {
                questionnaire.answer(option.id);
              }}
            />
          ))}
        </>
      )}
      {questionnaire.isSubmitting ? <LoadingState label={t(TRANSLATION_KEYS.tqSaving)} /> : null}
      {questionnaire.hasFailed ? (
        <>
          <Text variant="bodyMuted" tone="error">
            {t(TRANSLATION_KEYS.tqSaveFailed)}
          </Text>
          <PillButton
            tone="surface"
            label={t(TRANSLATION_KEYS.actionRetry)}
            onPress={questionnaire.retry}
            fullWidth
          />
        </>
      ) : null}
    </OnboardingStepLayout>
  );
};
