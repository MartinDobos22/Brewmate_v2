import type { AttributeInsight } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDecimal } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createInsightsCardStyles, insightBarShare } from './InsightsCard.styles';

const NOTHING = 0;

export interface InsightValueRowProps {
  readonly insight: AttributeInsight;
  /** The largest count on the screen, which every bar is drawn against. */
  readonly scale: number;
  /** Whether this is the most-brewed value in its own section. */
  readonly leads: boolean;
}

/**
 * One value and what this account has done with it.
 *
 * Counts, and nothing that looks like a score. How many cups is a fact; how
 * much somebody liked them is not a thing this product has ever measured, and
 * a percentage here would claim otherwise - which is why the bar is drawn
 * against the biggest count on the screen rather than against a full one.
 *
 * The figure printed is the cups. The bags and the pinned recipes behind the
 * same value are said out loud rather than printed: three numbers in a row
 * this narrow is a row nobody reads, and the one that answers "how much of my
 * brewing is this" is the first.
 */
export const InsightValueRow = ({ insight, scale, leads }: InsightValueRowProps): JSX.Element => {
  const styles = useThemedStyles(createInsightsCardStyles);
  const { t } = useTranslation();

  const spoken = [
    insight.value,
    t(TRANSLATION_KEYS.insightsValueCounts, {
      brews: insight.brewCount,
      bags: insight.bagCount,
    }),
    ...(insight.pinnedCount > NOTHING
      ? [t(TRANSLATION_KEYS.insightsValuePinned, { count: insight.pinnedCount })]
      : []),
  ].join(t(TRANSLATION_KEYS.suggestionSeparator));

  return (
    <View style={styles.row} accessibilityLabel={spoken}>
      <View style={styles.name}>
        <Text variant="bodyText" numberOfLines={1}>
          {insight.value}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            leads ? styles.lead : styles.rest,
            insightBarShare(insight.brewCount),
          ]}
        />
        <View style={insightBarShare(scale - insight.brewCount)} />
      </View>
      <View style={styles.count}>
        <Text variant="numericCaption" numeric>
          {formatDecimal(insight.brewCount)}
        </Text>
      </View>
    </View>
  );
};
