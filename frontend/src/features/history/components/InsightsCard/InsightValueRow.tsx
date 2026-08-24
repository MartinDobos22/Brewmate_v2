import type { AttributeInsight } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createInsightsCardStyles } from './InsightsCard.styles';

const NOTHING = 0;

export interface InsightValueRowProps {
  readonly insight: AttributeInsight;
}

/**
 * One value and what this account has done with it.
 *
 * Counts, and nothing that looks like a score. How many cups and how many bags
 * are facts; how much somebody liked them is not a thing this product has ever
 * measured, and a percentage here would claim otherwise.
 */
export const InsightValueRow = ({ insight }: InsightValueRowProps): JSX.Element => {
  const styles = useThemedStyles(createInsightsCardStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Text variant="bodyMedium">{insight.value}</Text>
      <Text variant="labelSmall" tone="muted">
        {[
          t(TRANSLATION_KEYS.insightsValueCounts, {
            brews: insight.brewCount,
            bags: insight.bagCount,
          }),
          ...(insight.pinnedCount > NOTHING
            ? [t(TRANSLATION_KEYS.insightsValuePinned, { count: insight.pinnedCount })]
            : []),
        ].join(t(TRANSLATION_KEYS.suggestionSeparator))}
      </Text>
    </View>
  );
};
