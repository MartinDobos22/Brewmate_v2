import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { INSIGHTS_COUNT_ICON } from '../../constants';
import { useInsights } from '../../hooks';
import { InsightsCard } from '../InsightsCard';
import { TasteSuggestionCard } from '../TasteSuggestionCard';

import { createInsightsScreenStyles } from './InsightsScreen.styles';

/**
 * The history, and the one question it is allowed to ask.
 *
 * Everything here works with no model at all. The paragraph on the suggestion
 * is the only part a model ever writes, and when it cannot be had the card
 * says so and the phone writes its own from the same counts.
 *
 * The denominator is on the second line rather than buried in the report,
 * because it is what the whole screen rests on: "najčastejšie Etiópia" means
 * one thing after forty cups and nothing at all after three, and a reader who
 * cannot see which of those they are looking at cannot judge any of it.
 */
export const InsightsScreen = (): JSX.Element => {
  const styles = useThemedStyles(createInsightsScreenStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const insights = useInsights();

  return (
    <Screen scrollable>
      <View style={styles.intro}>
        <Text variant="displayTitle">{t(TRANSLATION_KEYS.insightsTitle)}</Text>
        {insights.data === undefined ? null : (
          <View style={styles.denominator}>
            <MaterialCommunityIcons
              name={INSIGHTS_COUNT_ICON}
              size={theme.size.iconSmall}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMuted" tone="muted">
              {t(TRANSLATION_KEYS.insightsSubtitle, { count: insights.data.brewCount })}
            </Text>
          </View>
        )}
      </View>

      <QueryState
        isPending={insights.isPending}
        isError={insights.isError}
        error={insights.error}
        onRetry={(): void => {
          void insights.refetch();
        }}
      />

      {insights.data === undefined ? null : (
        <View style={styles.stack}>
          {insights.data.suggestion === null ? null : (
            <TasteSuggestionCard
              suggestion={insights.data.suggestion}
              brewCount={insights.data.brewCount}
            />
          )}
          <InsightsCard insights={insights.data} />
        </View>
      )}
    </Screen>
  );
};
