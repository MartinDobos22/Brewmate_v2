import type { RecipeTimelineEntry } from '@brewmate/shared';
import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { EmptyState, QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useRecipeTimeline } from '../../hooks';
import { readTimelineParams } from '../../services';
import { TimelineEntryCard } from '../TimelineEntryCard';

import { createTimelineScreenStyles } from './RecipeTimelineScreen.styles';

const NOTHING = 0;

/**
 * How one recipe got to where it is.
 *
 * Oldest version first, because it is read as a story: these were the numbers,
 * this is what was said about the cup, this is what changed because of it. A
 * flat list of recipes with dates carries the same rows and none of the
 * argument, which is why this screen exists separately from the cupboard.
 */
export const RecipeTimelineScreen = (): JSX.Element => {
  const styles = useThemedStyles(createTimelineScreenStyles);
  const { t } = useTranslation();
  const params = readTimelineParams(useLocalSearchParams());
  const timeline = useRecipeTimeline(params);

  const entries = timeline.data?.entries ?? [];

  return (
    <Screen scrollable>
      <View style={styles.intro}>
        <Text variant="headlineSmall">{t(TRANSLATION_KEYS.historyTimelineTitle)}</Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.historyTimelineSubtitle)}
        </Text>
      </View>

      <QueryState
        isPending={timeline.isPending}
        isError={timeline.isError}
        error={timeline.error}
        onRetry={(): void => {
          void timeline.refetch();
        }}
      />

      {timeline.isSuccess && entries.length === NOTHING ? (
        <EmptyState
          title={t(TRANSLATION_KEYS.historyTimelineEmptyTitle)}
          description={t(TRANSLATION_KEYS.historyTimelineEmptyBody)}
        />
      ) : null}

      <View style={styles.list}>
        {entries.map((entry: RecipeTimelineEntry, index: number): JSX.Element => (
          <TimelineEntryCard
            key={entry.recipe.id}
            entry={entry}
            index={index}
            total={entries.length}
          />
        ))}
      </View>
    </Screen>
  );
};
