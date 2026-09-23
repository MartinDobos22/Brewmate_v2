import type { JSX } from 'react';

import { PillButton, ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface WelcomeStepProps {
  readonly flow: OnboardingFlow;
}

/** What is about to happen, how long it takes, and that it can be stopped. */
export const WelcomeStep = ({ flow }: WelcomeStepProps): JSX.Element => {
  const { t } = useTranslation();
  const isResuming = flow.state.completedSteps.length > 0;

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.welcome} flow={flow}>
      <ScreenIntro
        title={t(TRANSLATION_KEYS.onboardingWelcomeTitle)}
        lead={t(TRANSLATION_KEYS.onboardingWelcomeBody)}
        note={t(
          isResuming
            ? TRANSLATION_KEYS.onboardingResumeNotice
            : TRANSLATION_KEYS.onboardingWelcomeDuration,
        )}
      />
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.onboardingWelcomeAction)}
        onPress={flow.goNext}
        fullWidth
      />
    </OnboardingStepLayout>
  );
};
