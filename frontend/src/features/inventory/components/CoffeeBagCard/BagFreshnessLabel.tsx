import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_FRESHNESS_LABEL_KEYS, BAG_FRESHNESS_TONES } from '../../constants/bagFreshnessLabels';
import { BAG_FRESHNESS, resolveBagFreshness } from '../../services/resolveBagFreshness';

export interface BagFreshnessLabelProps {
  readonly bag: CoffeeBag;
}

/**
 * Whether this bag is ready to drink, and how long it has been sitting there.
 *
 * The day count is printed next to the band rather than instead of it: the
 * band is the advice, the number is what makes it checkable.
 */
export const BagFreshnessLabel = ({ bag }: BagFreshnessLabelProps): JSX.Element => {
  const { t } = useTranslation();
  const { freshness, days } = resolveBagFreshness(bag);
  const label = t(BAG_FRESHNESS_LABEL_KEYS[freshness]);
  const withAge =
    freshness === BAG_FRESHNESS.unknown || days === null
      ? label
      : `${label} · ${String(days)} ${t(TRANSLATION_KEYS.unitDays)}`;

  return (
    <Text variant="labelMedium" tone={BAG_FRESHNESS_TONES[freshness]}>
      {withAge}
    </Text>
  );
};
