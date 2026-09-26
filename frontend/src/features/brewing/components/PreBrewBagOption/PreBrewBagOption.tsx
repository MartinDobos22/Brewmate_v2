import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { OptionCard } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { BAG_FRESHNESS_LABEL_KEYS } from '../../../inventory/constants';
import { resolveBagFreshness } from '../../../inventory/services';
import { PRE_BREW_COFFEE_ICONS } from '../../constants';

export interface PreBrewBagOptionProps {
  readonly bag: CoffeeBag;
  readonly selected: boolean;
  readonly onChoose: (bag: CoffeeBag) => void;
}

/**
 * One coffee, described by the two things that decide which one gets brewed.
 *
 * How much is left and whether it is ready - not the roaster and the origin,
 * which are what somebody reads when choosing what to buy rather than what to
 * open this morning. As a chip this could carry neither, so the choice was
 * made blind and the bag that had been resting three days looked exactly like
 * the one at its peak.
 *
 * An unweighed bag says nothing about its weight rather than claiming a zero:
 * `remainingGrams` of null means unmeasured, not empty.
 */
export const PreBrewBagOption = ({
  bag,
  selected,
  onChoose,
}: PreBrewBagOptionProps): JSX.Element => {
  const { t } = useTranslation();
  const { freshness } = resolveBagFreshness(bag);

  const parts = [
    ...(bag.remainingGrams === null
      ? []
      : [
          `${t(TRANSLATION_KEYS.preBrewCoffeeRemaining)} ${formatGrams(bag.remainingGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`,
        ]),
    t(BAG_FRESHNESS_LABEL_KEYS[freshness]),
  ];

  return (
    <OptionCard
      label={bag.name}
      note={parts.join(t(TRANSLATION_KEYS.listSeparator))}
      icon={PRE_BREW_COFFEE_ICONS.bag}
      selected={selected}
      onPress={(): void => {
        onChoose(bag);
      }}
    />
  );
};
