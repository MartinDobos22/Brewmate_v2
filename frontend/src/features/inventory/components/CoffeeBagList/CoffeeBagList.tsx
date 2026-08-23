import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { ListItem } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { coffeeBagSummary } from '../../services/coffeeBagSummary';

export interface CoffeeBagListProps {
  readonly bags: readonly CoffeeBag[];
}

/** The cupboard, newest bag first, as the API returns it. */
export const CoffeeBagList = ({ bags }: CoffeeBagListProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <View>
      {bags.map((bag: CoffeeBag): JSX.Element => (
        <ListItem
          key={bag.id}
          title={bag.name}
          subtitle={coffeeBagSummary(bag, t(TRANSLATION_KEYS.inventoryBagUnknownDetails))}
          showDivider
        />
      ))}
    </View>
  );
};
