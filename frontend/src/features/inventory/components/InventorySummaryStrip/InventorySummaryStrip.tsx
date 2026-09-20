import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDecimal, formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { summariseInventory } from '../../services';

import { createInventorySummaryStripStyles } from './InventorySummaryStrip.styles';

export interface InventorySummaryStripProps {
  readonly bags: readonly CoffeeBag[];
}

/**
 * What the shelf adds up to: how much, how many, how many ready.
 *
 * The same three numbers the home screen's cupboard tile prints, from the same
 * function - the two are one tap apart, and a person who can see both within a
 * second is a person who will notice them disagreeing.
 *
 * How much is left leads, because it is the only one of the three that decides
 * anything: the other two are how that mass is arranged. An unweighed cupboard
 * says so in words instead of printing a nought, because zero grams and
 * "nobody weighed any of it" are different facts and only one of them means
 * somebody has to go shopping.
 */
export const InventorySummaryStrip = ({ bags }: InventorySummaryStripProps): JSX.Element => {
  const styles = useThemedStyles(createInventorySummaryStripStyles);
  const { t } = useTranslation();
  const summary = summariseInventory(bags);

  return (
    <View style={styles.strip} accessibilityLabel={t(TRANSLATION_KEYS.inventorySummaryLabel)}>
      <View style={styles.cell}>
        {summary.remainingGrams === null ? (
          <Text variant="itemTitle" tone="muted">
            {t(TRANSLATION_KEYS.inventorySummaryUnweighed)}
          </Text>
        ) : (
          <Text variant="numericSummary" numeric>
            {formatGrams(summary.remainingGrams)}
          </Text>
        )}
        <Text variant="eyebrow" tone="muted">
          {t(TRANSLATION_KEYS.inventorySummaryRemaining)}
        </Text>
      </View>
      <View style={styles.rule} />
      <View style={styles.cell}>
        <Text variant="numericSummary" numeric>
          {formatDecimal(summary.bagCount)}
        </Text>
        <Text variant="eyebrow" tone="muted">
          {t(TRANSLATION_KEYS.inventorySummaryBags)}
        </Text>
      </View>
      <View style={styles.rule} />
      <View style={styles.cell}>
        <Text variant="numericSummary" tone="fresh" numeric>
          {formatDecimal(summary.readyCount)}
        </Text>
        <Text variant="eyebrow" tone="muted">
          {t(TRANSLATION_KEYS.inventorySummaryReady)}
        </Text>
      </View>
    </View>
  );
};
