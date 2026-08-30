import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createInventoryTileStyles } from './InventoryTile.styles';

export interface InventoryAmountProps {
  /** Null when not one bag in the cupboard was ever weighed. */
  readonly grams: number | null;
}

/**
 * How much coffee is left, or the admission that nobody weighed any of it.
 *
 * Zero grams and "not recorded" are different facts and only one of them means
 * somebody has to go shopping, so the unweighed cupboard says so in words
 * rather than printing a confident nought under a heading.
 */
export const InventoryAmount = ({ grams }: InventoryAmountProps): JSX.Element => {
  const styles = useThemedStyles(createInventoryTileStyles);
  const { t } = useTranslation();

  if (grams === null) {
    return <Text variant="titleMedium">{t(TRANSLATION_KEYS.homeTileInventoryUnweighed)}</Text>;
  }

  return (
    <View
      style={styles.amount}
      accessibilityLabel={t(TRANSLATION_KEYS.homeTileInventoryRemainingLabel)}
    >
      <Text variant="numericLarge" numeric>
        {formatGrams(grams)}
      </Text>
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.unitGrams)}
      </Text>
    </View>
  );
};
