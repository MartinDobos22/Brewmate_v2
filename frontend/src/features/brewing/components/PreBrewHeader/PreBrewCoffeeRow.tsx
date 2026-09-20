import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BAG_FRESHNESS_LABEL_KEYS } from '../../../inventory/constants';
import { resolveBagFreshness } from '../../../inventory/services';
import { PRE_BREW_COFFEE_ICONS } from '../../constants';

import { createPreBrewHeaderStyles } from './PreBrewHeader.styles';

const EMPTY = '';

export interface PreBrewCoffeeRowProps {
  readonly bag: CoffeeBag | null;
  readonly description: string;
  readonly onChange: () => void;
}

/**
 * Which coffee, and the one way to choose a different one.
 *
 * Three facts and no more: what it is, how much is left, and whether it is
 * ready. They are the three the rest of this screen is written around - the
 * dose window, the roast the recipe assumes, whether the bag is worth opening
 * this morning - so they belong in the block the screen leads with.
 */
export const PreBrewCoffeeRow = ({
  bag,
  description,
  onChange,
}: PreBrewCoffeeRowProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const name =
    bag?.name ??
    (description.trim() === EMPTY ? t(TRANSLATION_KEYS.preBrewPlanUnknownCoffee) : description);

  const rowStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.row,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={rowStyle}
      onPress={onChange}
      accessibilityRole="button"
      accessibilityLabel={t(TRANSLATION_KEYS.preBrewCoffeeChange)}
    >
      <View style={[styles.badge, styles.badgeBean]}>
        <MaterialCommunityIcons
          name={PRE_BREW_COFFEE_ICONS.bag}
          size={theme.size.iconMedium}
          color={theme.colors.freshContainer}
        />
      </View>
      <View style={styles.body}>
        <Text variant="cardTitle" tone="onEspresso" numberOfLines={1}>
          {name}
        </Text>
        {bag === null ? null : (
          <View style={styles.meta}>
            <MaterialCommunityIcons
              name={PRE_BREW_COFFEE_ICONS.remaining}
              size={theme.size.iconTiny}
              color={theme.colors.onEspressoVariant}
            />
            <Text variant="caption" tone="onEspressoMuted" numeric>
              {bag.remainingGrams === null
                ? t(TRANSLATION_KEYS.inventoryRemainingUnknown)
                : `${formatGrams(bag.remainingGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`}
            </Text>
            <View style={styles.dot} />
            <Text variant="caption" tone="accentSoft">
              {t(BAG_FRESHNESS_LABEL_KEYS[resolveBagFreshness(bag).freshness])}
            </Text>
          </View>
        )}
      </View>
      <MaterialCommunityIcons
        name={PRE_BREW_COFFEE_ICONS.change}
        size={theme.size.iconMedium}
        color={theme.colors.accentOnEspresso}
      />
    </Pressable>
  );
};
