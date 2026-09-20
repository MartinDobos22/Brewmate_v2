import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
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
  const theme = useTheme();
  const { t } = useTranslation();

  const brewStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.brew,
    pressed && styles.pressed,
  ];

  const archiveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.archive,
    pressed && styles.pressed,
  ];

  return (
    <View style={styles.actions}>
      <Pressable
        style={brewStyle}
        onPress={onBrew}
        accessibilityRole="button"
        accessibilityLabel={t(TRANSLATION_KEYS.bagDetailBrewTitle)}
      >
        <MaterialCommunityIcons
          name={INVENTORY_TILE_ICONS.brew}
          size={theme.size.iconSmall}
          color={theme.colors.cream}
        />
        <Text variant="actionLabel" tone="onCream">
          {t(TRANSLATION_KEYS.bagDetailBrewTitle)}
        </Text>
      </Pressable>
      <Pressable
        style={archiveStyle}
        onPress={onArchive}
        disabled={archiving}
        accessibilityRole="button"
        accessibilityLabel={t(TRANSLATION_KEYS.inventoryBagArchive)}
      >
        <Text variant="actionLabel" tone={archiving ? 'disabled' : 'default'}>
          {t(TRANSLATION_KEYS.inventoryBagArchive)}
        </Text>
      </Pressable>
    </View>
  );
};
