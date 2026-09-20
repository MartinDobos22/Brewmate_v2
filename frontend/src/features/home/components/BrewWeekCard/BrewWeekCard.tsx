import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDecimal } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { HOME_TILE_ICONS } from '../../constants';
import { useBrewStats } from '../../hooks';

import { BrewSparkline } from './BrewSparkline';
import { createBrewWeekCardStyles } from './BrewWeekCard.styles';

/**
 * A week of brewing, and nothing more than a week.
 *
 * Deliberately not a lifetime total. One page of logs cannot honestly say how
 * many cups an account has ever made, and the profile's own brew count means
 * something else again - it counts the cups that were described rather than
 * the cups that were brewed. A number that needs a paragraph beside it is a
 * number that will be misread, so this one says what it counts.
 *
 * With no cups behind it the card does not print a nought and a flat chart.
 * Zero bars over "0" is a graph of nothing, drawn with the same confidence as
 * a graph of something; a glyph and a sentence say the same thing without
 * pretending to be a measurement.
 */
export const BrewWeekCard = (): JSX.Element => {
  const styles = useThemedStyles(createBrewWeekCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const stats = useBrewStats();
  const isEmpty = !stats.hasBrewed;

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.card,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={(): void => {
        router.push(isEmpty ? ROUTES.quickBrew : ROUTES.insights);
      }}
      accessibilityRole="button"
      accessibilityLabel={t(TRANSLATION_KEYS.homeTileStatsTitle)}
    >
      <Text variant="eyebrow" tone="muted">
        {t(TRANSLATION_KEYS.homeTileStatsTitle)}
      </Text>
      {isEmpty ? (
        <>
          <MaterialCommunityIcons
            name={HOME_TILE_ICONS.stats}
            size={theme.size.methodGlyphSize}
            color={theme.colors.onSurfaceEmpty}
          />
          <Text variant="caption" tone="muted">
            {t(TRANSLATION_KEYS.homeTileStatsNone)}
          </Text>
        </>
      ) : (
        <>
          <View style={styles.count}>
            <Text
              variant="numericSummary"
              numeric
              accessibilityLabel={t(TRANSLATION_KEYS.homeTileStatsTotalLabel)}
            >
              {formatDecimal(stats.total)}
            </Text>
            <Text variant="caption" tone="muted">
              {t(TRANSLATION_KEYS.homeTileStatsCaption)}
            </Text>
          </View>
          <BrewSparkline days={stats.days} />
        </>
      )}
    </Pressable>
  );
};
