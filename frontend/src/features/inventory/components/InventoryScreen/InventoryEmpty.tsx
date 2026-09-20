import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { ActionRow, InfoNote, Text } from '../../../../components/ui';
import { buildScanRoute, ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_SCAN_MODES } from '../../../bagEvaluations/constants';
import { INVENTORY_TILE_ICONS, SHOP_HELP_ICON } from '../../constants';

import { EmptyCupboardMark } from './EmptyCupboardMark';
import { createInventoryEmptyStyles } from './InventoryEmpty.styles';

export interface InventoryEmptyProps {
  readonly onAddManually: () => void;
}

/**
 * A cupboard nobody has filled in yet, which is the state most people start in
 * rather than an exception.
 *
 * Three ways out, in the order they suit the person reading them: photograph a
 * bag, type one in, or - quieter, for somebody with nothing at home at all -
 * go and be advised in a shop. The last is the one case where this app can
 * help immediately rather than after a purchase, which is why it is offered
 * here instead of being somewhere they would have to find it.
 *
 * The closing line says why an empty shelf is normal. Without it the screen
 * asserts that it is and gives no reason, which reads as an app being kind
 * about a mistake somebody made.
 */
export const InventoryEmpty = ({ onAddManually }: InventoryEmptyProps): JSX.Element => {
  const styles = useThemedStyles(createInventoryEmptyStyles);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.figure}>
        <EmptyCupboardMark />
        <View style={styles.words}>
          <Text variant="displayCompact" align="center">
            {t(TRANSLATION_KEYS.inventoryEmptyTitle)}
          </Text>
          <Text variant="bodyText" tone="muted" align="center">
            {t(TRANSLATION_KEYS.inventoryEmptyBody)}
          </Text>
        </View>
      </View>
      <View style={styles.ways}>
        <ActionRow
          tone="espresso"
          icon={INVENTORY_TILE_ICONS.scan}
          title={t(TRANSLATION_KEYS.inventoryTileScanTitle)}
          caption={t(TRANSLATION_KEYS.inventoryTileScanCaption)}
          onPress={(): void => {
            router.push(buildScanRoute(BAG_SCAN_MODES.inventory));
          }}
        />
        <ActionRow
          icon={INVENTORY_TILE_ICONS.manual}
          title={t(TRANSLATION_KEYS.inventoryTileManualTitle)}
          caption={t(TRANSLATION_KEYS.inventoryTileManualCaption)}
          onPress={onAddManually}
        />
      </View>
      <ActionRow
        tone="fresh"
        icon={SHOP_HELP_ICON}
        title={t(TRANSLATION_KEYS.inventoryNoCoffeeYet)}
        onPress={(): void => {
          router.push(ROUTES.scan);
        }}
      />
      <InfoNote text={t(TRANSLATION_KEYS.inventoryEmptyNote)} />
    </View>
  );
};
