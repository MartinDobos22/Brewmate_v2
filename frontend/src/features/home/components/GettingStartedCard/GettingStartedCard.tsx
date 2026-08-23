import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, ProgressBar, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useGettingStarted } from '../../hooks/useGettingStarted';
import { formatStepCount } from '../../services/formatStepCount';
import type { GettingStartedStep } from '../../services/readGettingStartedSteps';

import { createGettingStartedCardStyles } from './GettingStartedCard.styles';
import { GettingStartedStepItem } from './GettingStartedStepItem';

const LAST_OFFSET = 1;

/**
 * What a new account sees instead of a dashboard.
 *
 * Three steps, each a tap into the flow it names, ticked off from what the
 * account actually holds. It leaves on its own when all three are done, and
 * can be dismissed at any point - the app underneath works either way.
 */
export const GettingStartedCard = (): JSX.Element | null => {
  const styles = useThemedStyles(createGettingStartedCardStyles);
  const { t } = useTranslation();
  const gettingStarted = useGettingStarted();

  if (!gettingStarted.isVisible) {
    return null;
  }

  return (
    <Card variant="container">
      <View style={styles.header}>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.homeStartTitle)}</Text>
        <Text variant="labelMedium" tone="muted" numeric>
          {formatStepCount(
            gettingStarted.completed,
            gettingStarted.total,
            t(TRANSLATION_KEYS.homeStartCountSeparator),
          )}
        </Text>
      </View>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.homeStartBody)}
      </Text>
      <View style={styles.progress}>
        <ProgressBar
          current={gettingStarted.completed}
          total={gettingStarted.total}
          label={t(TRANSLATION_KEYS.homeStartProgressLabel)}
        />
      </View>
      {gettingStarted.steps.map((step: GettingStartedStep, index: number): JSX.Element => (
        <GettingStartedStepItem
          key={step.id}
          step={step}
          showDivider={index < gettingStarted.steps.length - LAST_OFFSET}
        />
      ))}
      <Button
        label={t(TRANSLATION_KEYS.homeStartHide)}
        variant="tertiary"
        size="small"
        onPress={gettingStarted.hide}
      />
    </Card>
  );
};
