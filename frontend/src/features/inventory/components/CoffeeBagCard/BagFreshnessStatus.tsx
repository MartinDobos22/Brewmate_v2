import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  BAG_FRESHNESS_ICONS,
  BAG_FRESHNESS_LABEL_KEYS,
  BAG_FRESHNESS_TONES,
} from '../../constants';
import { resolveBagFreshness } from '../../services/resolveBagFreshness';

import { createCoffeeBagCardStyles } from './CoffeeBagCard.styles';
import { STATUS_ICON_COLORS } from './bagStatusColors';

export interface BagFreshnessStatusProps {
  readonly bag: CoffeeBag;
}

/**
 * What to do with this bag, in one line.
 *
 * The dial beside it says how far through its window the coffee is; this says
 * what that means. It carries a glyph as well as a colour, because a line that
 * relies on the difference between a green and an ochre is a line somebody
 * cannot read - and the day count is already in the dial, so the words are
 * free to be advice rather than a measurement.
 */
export const BagFreshnessStatus = ({ bag }: BagFreshnessStatusProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const { freshness } = resolveBagFreshness(bag);

  return (
    <View style={styles.status}>
      <MaterialCommunityIcons
        name={BAG_FRESHNESS_ICONS[freshness]}
        size={theme.size.iconSmall}
        color={theme.colors[STATUS_ICON_COLORS[freshness]]}
      />
      <Text variant="statusLabel" tone={BAG_FRESHNESS_TONES[freshness]}>
        {t(BAG_FRESHNESS_LABEL_KEYS[freshness])}
      </Text>
    </View>
  );
};
