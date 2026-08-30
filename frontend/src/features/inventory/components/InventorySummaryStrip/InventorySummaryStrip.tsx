import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDecimal, formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { summariseInventory } from '../../services';

import { createInventorySummaryStripStyles } from './InventorySummaryStrip.styles';

export interface InventorySummaryStripProps {
  readonly bags: readonly CoffeeBag[];
}

/**
 * What the shelf adds up to: how many, how much, how many ready.
 *
 * The same three numbers the home screen's cupboard tile prints, from the same
 * function - the two are one tap apart, and a person who can see both within a
 * second is a person who will notice them disagreeing.
 *
 * An unweighed cupboard says so in words instead of printing a nought. Zero
 * grams and "nobody weighed any of it" are different facts and only one of
 * them means somebody has to go shopping.
 */
export const InventorySummaryStrip = ({ bags }: InventorySummaryStripProps): JSX.Element => {
  const styles = useThemedStyles(createInventorySummaryStripStyles);
  const { t } = useTranslation();
  const summary = summariseInventory(bags);

  return (
    <Card variant="container">
      <View style={styles.strip} accessibilityLabel={t(TRANSLATION_KEYS.inventorySummaryLabel)}>
        <View style={styles.cell}>
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.inventorySummaryBags)}
          </Text>
          <Text variant="numericMedium" numeric>
            {formatDecimal(summary.bagCount)}
          </Text>
        </View>
        <View style={styles.cell}>
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.inventorySummaryRemaining)}
          </Text>
          {summary.remainingGrams === null ? (
            <Text variant="labelMedium" tone="muted">
              {t(TRANSLATION_KEYS.inventorySummaryUnweighed)}
            </Text>
          ) : (
            <View style={styles.value}>
              <Text variant="numericMedium" numeric>
                {formatGrams(summary.remainingGrams)}
              </Text>
              <Text variant="labelSmall" tone="muted">
                {t(TRANSLATION_KEYS.unitGrams)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.cell}>
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.inventorySummaryReady)}
          </Text>
          <Text variant="numericMedium" numeric>
            {formatDecimal(summary.readyCount)}
          </Text>
        </View>
      </View>
    </Card>
  );
};
