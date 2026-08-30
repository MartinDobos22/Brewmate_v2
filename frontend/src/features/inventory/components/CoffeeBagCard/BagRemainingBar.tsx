import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { ProgressBar, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { BagRemainingLabel } from './BagRemainingLabel';
import { createBagRemainingBarStyles } from './BagRemainingBar.styles';

export interface BagRemainingBarProps {
  readonly bag: CoffeeBag;
}

/**
 * How much of the bag is left, drawn as well as written.
 *
 * The bar needs both numbers - what is left and what the bag held - so it only
 * appears when both are known. A bar drawn against a guessed capacity would be
 * a picture of a measurement nobody took, which is worse than the sentence
 * underneath saying plainly that nobody weighed it.
 *
 * Full is clamped, because somebody can top a jar up past what the label said
 * and a bar that overflowed its track would read as a bug rather than as
 * generosity.
 */
export const BagRemainingBar = ({ bag }: BagRemainingBarProps): JSX.Element => {
  const styles = useThemedStyles(createBagRemainingBarStyles);
  const { t } = useTranslation();

  if (bag.remainingGrams === null || bag.weightGrams === null) {
    return <BagRemainingLabel bag={bag} />;
  }

  const remaining = Math.min(bag.remainingGrams, bag.weightGrams);
  const capacity = `${formatGrams(bag.weightGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <BagRemainingLabel bag={bag} />
        <Text variant="labelSmall" tone="muted" numeric>
          {capacity}
        </Text>
      </View>
      <ProgressBar
        current={remaining}
        total={bag.weightGrams}
        label={t(TRANSLATION_KEYS.inventoryBagRemainingLabel)}
      />
    </View>
  );
};
