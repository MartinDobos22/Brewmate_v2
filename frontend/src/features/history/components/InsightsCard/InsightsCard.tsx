import { INSIGHT_MIN_BREWS, type AttributeInsight, type InsightsResponse } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { groupInsightsByAttribute, INSIGHT_ATTRIBUTE_LABEL_KEYS } from '../../services';
import type { InsightGroup } from '../../services/groupInsightsByAttribute';

import { createInsightsCardStyles } from './InsightsCard.styles';
import { InsightValueRow } from './InsightValueRow';

const NOTHING = 0;

export interface InsightsCardProps {
  readonly insights: InsightsResponse;
}

/**
 * What a stretch of brewing adds up to.
 *
 * Below the threshold it says so and says what would change it, rather than
 * ranking three cups: "najčastejšie Etiópia" means one thing after forty cups
 * and nothing at all after three, and a report that did not know the
 * difference would be the first thing on this screen nobody believes.
 */
export const InsightsCard = ({ insights }: InsightsCardProps): JSX.Element => {
  const styles = useThemedStyles(createInsightsCardStyles);
  const { t } = useTranslation();

  const groups = groupInsightsByAttribute(insights.attributes);

  return (
    <Card>
      <View style={styles.header}>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.insightsTitle)}</Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.insightsSubtitle, { count: insights.brewCount })}
        </Text>
      </View>

      {groups.length === NOTHING ? (
        <>
          <Text variant="titleSmall">{t(TRANSLATION_KEYS.insightsTooFewTitle)}</Text>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.insightsTooFewBody, { count: INSIGHT_MIN_BREWS })}
          </Text>
        </>
      ) : null}

      {groups.map((group: InsightGroup): JSX.Element => (
        <View key={group.attribute} style={styles.group}>
          <Text variant="labelMedium" tone="muted">
            {t(INSIGHT_ATTRIBUTE_LABEL_KEYS[group.attribute])}
          </Text>
          {group.values.map((insight: AttributeInsight): JSX.Element => (
            <InsightValueRow key={insight.value} insight={insight} />
          ))}
        </View>
      ))}

      {groups.length === NOTHING ? null : (
        <View style={styles.disclaimer}>
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.insightsCountsNotRatings)}
          </Text>
        </View>
      )}
    </Card>
  );
};
