import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { coffeeBagSummary } from '../../services/coffeeBagSummary';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

export interface CoffeeBagHeaderProps {
  readonly bag: CoffeeBag;
}

/**
 * Which coffee this screen is about.
 *
 * The name and where it came from, and nothing else - what is left and whether
 * it is ready are the card underneath, because those two are the decision and
 * this is the label.
 */
export const CoffeeBagHeader = ({ bag }: CoffeeBagHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <ScreenIntro
        title={bag.name}
        lead={coffeeBagSummary(bag, t(TRANSLATION_KEYS.inventoryBagUnknownDetails))}
      />
    </View>
  );
};
