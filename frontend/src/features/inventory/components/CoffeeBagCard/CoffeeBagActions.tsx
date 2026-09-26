import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { INVENTORY_TILE_ICONS } from '../../constants';

import { createCoffeeBagCardStyles } from './CoffeeBagCard.styles';

export interface CoffeeBagActionsProps {
  readonly onBrew: () => void;
  readonly onArchive: () => void;
  readonly archiving: boolean;
}

/**
 * The two things somebody does to a bag without opening it.
 *
 * Brewing grows to fill the row and finishing the bag does not. One of them is
 * what this screen is for and the other happens once in a bag's life; at equal
 * widths the second reads as the ordinary choice.
 */
export const CoffeeBagActions = ({
  onBrew,
  onArchive,
  archiving,
}: CoffeeBagActionsProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagCardStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.actions}>
      <PillButton
        tone="espresso"
        size="small"
        grows
        icon={INVENTORY_TILE_ICONS.brew}
        label={t(TRANSLATION_KEYS.bagDetailBrewTitle)}
        onPress={onBrew}
      />
      <PillButton
        size="small"
        label={t(TRANSLATION_KEYS.inventoryBagArchive)}
        isPending={archiving}
        onPress={onArchive}
      />
    </View>
  );
};
