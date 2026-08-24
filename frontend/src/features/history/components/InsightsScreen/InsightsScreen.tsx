import type { JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { QueryState } from '../../../../components/ui';
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
 */
export const InsightsScreen = (): JSX.Element => {
  const styles = useThemedStyles(createInsightsScreenStyles);
  const insights = useInsights();

  return (
    <Screen scrollable>
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
