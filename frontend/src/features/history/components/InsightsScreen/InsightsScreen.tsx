import type { JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useInsights } from '../../hooks';
import { InsightsCard } from '../InsightsCard';
import { TasteSuggestionCard } from '../TasteSuggestionCard';

import { createInsightsScreenStyles } from './InsightsScreen.styles';

/**
 * The history, and the one question it is allowed to ask.
 *
 * The suggestion sits above the counts when there is one, because it is the
 * only thing on this screen that wants an answer - and below it the numbers it
 * was drawn from, so somebody who wants to disagree can see exactly what they
 * are disagreeing with.
 *
 * Everything here works with no model at all. The paragraph on the suggestion
 * is the only part a model ever writes, and when it cannot be had the card
 * says so and the phone writes its own from the same counts.
 *
 * The heading is the screen's rather than the counts card's. It was the only
 * screen in the app that opened with no statement of what it was, and having
 * the card underneath introduce the whole page meant the title moved down as
 * soon as there was a suggestion to answer.
 */
export const InsightsScreen = (): JSX.Element => {
  const styles = useThemedStyles(createInsightsScreenStyles);
  const { t } = useTranslation();
  const insights = useInsights();

  return (
    <Screen scrollable>
      <View style={styles.intro}>
        <Text variant="headlineSmall">{t(TRANSLATION_KEYS.insightsTitle)}</Text>
        {insights.data === undefined ? null : (
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.insightsSubtitle, { count: insights.data.brewCount })}
          </Text>
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
