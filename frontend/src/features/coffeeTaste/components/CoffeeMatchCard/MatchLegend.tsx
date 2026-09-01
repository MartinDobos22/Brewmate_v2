import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createMatchLegendStyles } from './CoffeeMatchCard.styles';

/**
 * Which shape is which.
 *
 * Two polygons on one web is only readable if nobody has to guess which one
 * they are, and "the filled one is you" is not something a chart can say by
 * itself. The swatches are built from the same two colours the shapes are
 * drawn in, so a change to either is a change to both.
 */
export const MatchLegend = (): JSX.Element => {
  const styles = useThemedStyles(createMatchLegendStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.legend}>
      <View style={styles.entry}>
        <View style={styles.youSwatch} />
        <Text variant="labelSmall" tone="muted">
          {t(TRANSLATION_KEYS.matchLegendYou)}
        </Text>
      </View>
      <View style={styles.entry}>
        <View style={styles.coffeeSwatch} />
        <Text variant="labelSmall" tone="muted">
          {t(TRANSLATION_KEYS.matchLegendCoffee)}
        </Text>
      </View>
    </View>
  );
};
