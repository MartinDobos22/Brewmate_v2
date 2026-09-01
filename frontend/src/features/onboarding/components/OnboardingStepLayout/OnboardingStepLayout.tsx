import type { JSX, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { OnboardingStep } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingProgress } from '../OnboardingProgress';

import { createOnboardingStepLayoutStyles } from './OnboardingStepLayout.styles';

export interface OnboardingStepLayoutProps {
  readonly step: OnboardingStep;
  readonly flow: OnboardingFlow;
  readonly children: ReactNode;
  /** Overrides the flow's own back, for a step that navigates inside itself. */
  readonly onBack?: () => void;
  readonly canGoBack?: boolean;
  /** A step that scrolls its own content - a long list - turns this off. */
  readonly scrollable?: boolean;
  /** What this step counts inside itself, printed under the flow's own bar. */
  readonly note?: string;
}

/**
 * The frame every onboarding step sits in: where you are, the way back, and
 * the way out.
 *
 * The way out is on every single screen on purpose. Onboarding a user cannot
 * leave is onboarding they leave the app from instead, and what they answered
 * so far is already saved either way.
 */
export const OnboardingStepLayout = ({
  step,
  flow,
  children,
  onBack,
  canGoBack,
  scrollable = true,
  note,
}: OnboardingStepLayoutProps): JSX.Element => {
  const styles = useThemedStyles(createOnboardingStepLayoutStyles);
  const { t } = useTranslation();
  const backEnabled = canGoBack ?? flow.canGoBack;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        {backEnabled ? (
          <Button
            label={t(TRANSLATION_KEYS.actionBack)}
            variant="tertiary"
            size="small"
            onPress={onBack ?? flow.goBack}
          />
        ) : (
          <View />
        )}
        <Button
          label={t(
            flow.isSingleStep ? TRANSLATION_KEYS.actionDone : TRANSLATION_KEYS.onboardingSkipAll,
          )}
          variant="tertiary"
          size="small"
          onPress={flow.leave}
        />
      </View>
      {flow.progress === null && note === undefined ? null : (
        <OnboardingProgress step={step} progress={flow.progress} note={note} />
      )}
      {scrollable ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.scroll, styles.content]}>{children}</View>
      )}
      {flow.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.onboardingSaveError)}
        </Text>
      ) : null}
    </View>
  );
};
