import type { JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { Card, QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useAiUsageSummary } from '../../hooks';
import { AccountDataCard } from '../AccountDataCard';
import { AiUsageWindowCard } from '../AiUsageWindowCard';

import { AiCostBreakdown } from './AiCostBreakdown';
import { createAiCostScreenStyles } from './AiCostScreen.styles';

/**
 * What the model calls cost, and what happens when they run out.
 *
 * The sentence at the bottom is the one this screen exists for. An account at
 * its ceiling has lost the things that ask a model a question and nothing
 * else: brewing from a stored recipe, adding a bag by hand and the whole
 * history keep working. Saying so is the difference between a limit and a
 * punishment - and between somebody waiting for midnight and somebody
 * uninstalling.
 *
 * The export sits on the same screen because it answers the neighbouring
 * question: this is what the app knows about you, and this is how you take it
 * away with you.
 */
export const AiCostScreen = (): JSX.Element => {
  const styles = useThemedStyles(createAiCostScreenStyles);
  const { t } = useTranslation();
  const summary = useAiUsageSummary();

  return (
    <Screen scrollable>
      <View style={styles.intro}>
        <Text variant="headlineSmall">{t(TRANSLATION_KEYS.aiCostsTitle)}</Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.aiCostsSubtitle)}
        </Text>
      </View>

      <QueryState
        isPending={summary.isPending}
        isError={summary.isError}
        error={summary.error}
        onRetry={(): void => {
          void summary.refetch();
        }}
      />

      {summary.data === undefined ? null : (
        <View style={styles.stack}>
          <AiUsageWindowCard
            window={summary.data.day}
            titleKey={TRANSLATION_KEYS.aiCostsDayTitle}
          />
          <AiUsageWindowCard
            window={summary.data.month}
            titleKey={TRANSLATION_KEYS.aiCostsMonthTitle}
          />
          <AiCostBreakdown totals={summary.data.byFunction} />
          <Card variant="container">
            <Text variant="titleMedium">{t(TRANSLATION_KEYS.aiCostsWhatCountsTitle)}</Text>
            <Text variant="bodySmall" tone="muted">
              {t(TRANSLATION_KEYS.aiCostsWhatCountsBody)}
            </Text>
          </Card>
          <AccountDataCard />
        </View>
      )}
    </Screen>
  );
};
