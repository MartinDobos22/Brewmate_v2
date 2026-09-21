import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { INSIGHT_MIN_BREWS, type AttributeInsight, type InsightsResponse } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  groupInsightsByAttribute,
  readInsightScale,
  INSIGHT_ATTRIBUTE_ICONS,
  INSIGHT_ATTRIBUTE_LABEL_KEYS,
} from '../../services';
import type { InsightGroup } from '../../services/groupInsightsByAttribute';
import { INSIGHTS_NOTE_ICON } from '../../constants';

import { createInsightsCardStyles } from './InsightsCard.styles';
import { InsightValueRow } from './InsightValueRow';

const NOTHING = 0;
const FIRST = 0;

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
 *
 * Every bar on the screen is drawn against the same largest count, so the
 * three cards can be read one after another: fourteen washed coffees really
 * is a bigger number than nine Ethiopian ones, and scaling each card to its
 * own top row would have made three unrelated shelves look equally well
 * evidenced.
 */
export const InsightsCard = ({ insights }: InsightsCardProps): JSX.Element => {
  const styles = useThemedStyles(createInsightsCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const groups = groupInsightsByAttribute(insights.attributes);
  const scale = readInsightScale(insights.attributes);

  if (groups.length === NOTHING) {
    return (
      <View style={styles.empty}>
        <Text variant="cardTitle">{t(TRANSLATION_KEYS.insightsTooFewTitle)}</Text>
        <Text variant="bodyMuted" tone="muted">
          {t(TRANSLATION_KEYS.insightsTooFewBody, { count: INSIGHT_MIN_BREWS })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {groups.map((group: InsightGroup): JSX.Element => (
        <View key={group.attribute} style={styles.card}>
          <View style={styles.heading}>
            <MaterialCommunityIcons
              name={INSIGHT_ATTRIBUTE_ICONS[group.attribute]}
              size={theme.size.iconRow}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="eyebrow" tone="muted">
              {t(INSIGHT_ATTRIBUTE_LABEL_KEYS[group.attribute])}
            </Text>
          </View>
          <View style={styles.rows}>
            {group.values.map((insight: AttributeInsight, index: number): JSX.Element => (
              <InsightValueRow
                key={insight.value}
                insight={insight}
                scale={scale}
                leads={index === FIRST}
              />
            ))}
          </View>
        </View>
      ))}
      <View style={styles.note}>
        <MaterialCommunityIcons
          name={INSIGHTS_NOTE_ICON}
          size={theme.size.iconSmall}
          color={theme.colors.onSurfaceVariant}
        />
        <View style={styles.name}>
          <Text variant="caption" tone="muted">
            {t(TRANSLATION_KEYS.insightsCountsNotRatings)}
          </Text>
        </View>
      </View>
    </View>
  );
};
