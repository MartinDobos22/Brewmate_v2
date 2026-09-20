import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { StepProgress, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  ONBOARDING_STEP_ICONS,
  ONBOARDING_STEP_LABEL_KEYS,
  type OnboardingStep,
} from '../../constants';
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
  readonly note?: StepProgressState;
}

/**
 * Where the user is, and how much of the flow is still ahead of them.
 *
 * The count is the part that was missing. This is the longest flow in the app,
 * and a bar that filled without ever saying "krok 3 zo 7" left somebody three
 * screens in with no way to tell whether they were nearly finished or had
 * barely started - which is exactly when a person decides to leave.
 *
 * The count sits on the same line as the name rather than above the bar,
 * because both answer "where am I" and stacking them made three lines of
 * chrome above a question that is the reason the screen exists. Where the step
 * counts something of its own, that count wins the slot: inside the
 * questionnaire "otázka 2 z 8" is the honest answer, and the flow's own
 * position has not moved for eight screens.
 */
export const OnboardingProgress = ({
  step,
  progress,
  note,
}: OnboardingProgressProps): JSX.Element => {
  const styles = useThemedStyles(createOnboardingProgressStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const named = isProgressStep(step);
  /*
   * The step's own count wins the slot where it has one. Inside the
   * questionnaire "2/8" is the honest answer to how much is left, and the
   * flow's own position has not moved for eight screens.
   */
  const counted = note ?? progress;
  /*
   * Spread into plain values rather than handed over whole: the interpolator
   * takes a bag of named holes, and a typed pair is not one of those.
   */
  const count = counted === null ? null : { current: counted.current, total: counted.total };

  return (
    <View style={styles.wrapper}>
      {named || count !== null ? (
        <View style={styles.heading}>
          {named ? (
            <MaterialCommunityIcons
              name={ONBOARDING_STEP_ICONS[step]}
              size={theme.size.iconRow}
              color={theme.colors.primary}
            />
          ) : null}
          <View style={styles.name}>
            {named ? (
              <Text variant="eyebrow" tone="muted">
                {t(ONBOARDING_STEP_LABEL_KEYS[step])}
              </Text>
            ) : null}
          </View>
          {count === null ? null : (
            <Text
              variant="numericLabel"
              tone="muted"
              numeric
              accessibilityLabel={t(TRANSLATION_KEYS.stepCount, count)}
            >
              {t(TRANSLATION_KEYS.stepCountShort, count)}
            </Text>
          )}
        </View>
      ) : null}
      {progress === null ? null : (
        <StepProgress current={progress.current} total={progress.total} showCount={false} />
      )}
    </View>
  );
};
