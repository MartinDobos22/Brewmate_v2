import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ONBOARDING_STEP_LABEL_KEYS, type OnboardingStep } from '../../constants/onboardingSteps';
import { isProgressStep, type StepProgress } from '../../services/onboardingSteps';

import { createOnboardingProgressStyles, progressShare } from './OnboardingProgress.styles';

export interface OnboardingProgressProps {
  readonly step: OnboardingStep;
  readonly progress: StepProgress;
}

const DONE = 0;

/** Where the user is, and how much of the flow is still ahead of them. */
export const OnboardingProgress = ({ step, progress }: OnboardingProgressProps): JSX.Element => {
  const styles = useThemedStyles(createOnboardingProgressStyles);
  const { t } = useTranslation();
  const remaining = progress.total - progress.current;

  return (
    <View style={styles.wrapper}>
      {isProgressStep(step) ? (
        <Text variant="labelMedium" tone="muted">
          {t(ONBOARDING_STEP_LABEL_KEYS[step])}
        </Text>
      ) : null}
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityLabel={t(TRANSLATION_KEYS.onboardingProgressLabel)}
        accessibilityValue={{ min: DONE, max: progress.total, now: progress.current }}
      >
        <View style={[styles.fill, progressShare(progress.current)]} />
        <View style={progressShare(remaining)} />
      </View>
    </View>
  );
};
