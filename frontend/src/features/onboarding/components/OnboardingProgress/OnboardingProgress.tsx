import type { JSX } from 'react';
import { View } from 'react-native';

import { StepProgress, Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ONBOARDING_STEP_LABEL_KEYS, type OnboardingStep } from '../../constants/onboardingSteps';
import {
  isProgressStep,
  type StepProgress as StepProgressState,
} from '../../services/onboardingSteps';

import { createOnboardingProgressStyles } from './OnboardingProgress.styles';

export interface OnboardingProgressProps {
  readonly step: OnboardingStep;
  /** Null on a step opened on its own: there is no flow to count through. */
  readonly progress: StepProgressState | null;
  /**
   * What the step counts inside itself, where it counts anything.
   *
   * Written rather than drawn as a second bar. The questionnaire is one step
   * of the flow and eight screens inside it, and two segmented strips above
   * each other would be two answers to "how much more of this is there" - the
   * one question this whole component exists to answer once.
   */
  readonly note?: string;
}

/**
 * Where the user is, and how much of the flow is still ahead of them.
 *
 * The count is the part that was missing. This is the longest flow in the app
 * - seven questions - and a bar that filled without ever saying "krok 3 zo 7"
 * left somebody three screens in with no way to tell whether they were nearly
 * finished or had barely started, which is exactly when a person decides to
 * leave. The name of the step stays above it: knowing you are on the third of
 * seven is worth less than knowing the third one is about the grinder.
 *
 * The same segmented strip the scanner and the quick brew use, for the same
 * reason they share it: three flows answering one question three ways would be
 * three answers.
 */
export const OnboardingProgress = ({
  step,
  progress,
  note,
}: OnboardingProgressProps): JSX.Element => {
  const styles = useThemedStyles(createOnboardingProgressStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {isProgressStep(step) ? (
        <Text variant="labelMedium" tone="muted">
          {t(ONBOARDING_STEP_LABEL_KEYS[step])}
        </Text>
      ) : null}
      {progress === null ? null : (
        <StepProgress current={progress.current} total={progress.total} />
      )}
      {note === undefined ? null : (
        <Text variant="labelSmall" tone="muted">
          {note}
        </Text>
      )}
    </View>
  );
};
