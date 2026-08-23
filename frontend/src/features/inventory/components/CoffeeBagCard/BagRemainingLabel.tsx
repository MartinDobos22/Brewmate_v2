import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';

export interface BagRemainingLabelProps {
  readonly bag: CoffeeBag;
}

/**
 * How much coffee is left.
 *
 * A bag nobody weighed says so rather than showing a zero. Zero grams and "not
 * recorded" are different facts, and only one of them means somebody has to go
 * shopping.
 */
export const BagRemainingLabel = ({ bag }: BagRemainingLabelProps): JSX.Element => {
  const { t } = useTranslation();

  if (bag.remainingGrams === null) {
    return (
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.inventoryRemainingUnknown)}
      </Text>
    );
  }

  const remaining = `${formatGrams(bag.remainingGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`;

  return (
    <Text variant="labelMedium" numeric>
      {remaining}
    </Text>
  );
};
