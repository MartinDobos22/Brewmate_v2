import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { buildScanRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BAG_SCAN_MODES } from '../../../bagEvaluations/constants';
import { INVENTORY_TILE_ICONS } from '../../constants';

import { createInventoryHeaderStyles } from './InventoryHeader.styles';

export interface InventoryHeaderProps {
  readonly onAddManually: () => void;
}

/** What this screen is, and the two ways to add to it. */
export const InventoryHeader = ({ onAddManually }: InventoryHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createInventoryHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const scanStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.button,
    styles.scan,
    pressed && styles.pressed,
  ];

  const manualStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.button,
    pressed && styles.pressed,
  ];

  return (
    <View style={styles.row}>
      <Text variant="displayTitle">{t(TRANSLATION_KEYS.inventoryTitle)}</Text>
      <View style={styles.buttons}>
        <Pressable
          style={scanStyle}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.inventoryTileScanTitle)}
          onPress={(): void => {
            router.push(buildScanRoute(BAG_SCAN_MODES.inventory));
          }}
        >
          <MaterialCommunityIcons
            name={INVENTORY_TILE_ICONS.scan}
            size={theme.size.iconMedium}
            color={theme.colors.cream}
          />
        </Pressable>
        <Pressable
          style={manualStyle}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.inventoryTileManualTitle)}
          onPress={onAddManually}
        >
          <MaterialCommunityIcons
            name={INVENTORY_TILE_ICONS.manual}
            size={theme.size.iconMedium}
            color={theme.colors.espresso}
          />
        </Pressable>
      </View>
    </View>
  );
};
