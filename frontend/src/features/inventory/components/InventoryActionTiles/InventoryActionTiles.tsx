import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { Tile } from '../../../../components/ui';
import { buildScanRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_SCAN_MODES } from '../../../bagEvaluations/constants';
import { INVENTORY_TILE_ICONS } from '../../constants';

export interface InventoryActionTilesProps {
  readonly onAddManually: () => void;
}

/**
 * The two ways to put a coffee on the shelf, at the top rather than the
 * bottom.
 *
 * They used to be two full-width grey buttons under the list, below however
 * many bags somebody owns - which meant the more they used the app, the
 * further they had to scroll to use it again. The photograph goes first
 * because it is the one that does the typing for you; typing it in stays
 * beside it at the same size, because a build with no storage bucket has no
 * camera to offer and the manual route is then the only one.
 */
export const InventoryActionTiles = ({ onAddManually }: InventoryActionTilesProps): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TileRow>
      <Tile
        icon={INVENTORY_TILE_ICONS.scan}
        tone="primary"
        title={t(TRANSLATION_KEYS.inventoryTileScanTitle)}
        caption={t(TRANSLATION_KEYS.inventoryTileScanCaption)}
        onPress={(): void => {
          router.push(buildScanRoute(BAG_SCAN_MODES.inventory));
        }}
      />
      <Tile
        icon={INVENTORY_TILE_ICONS.manual}
        tone="accent"
        title={t(TRANSLATION_KEYS.inventoryTileManualTitle)}
        caption={t(TRANSLATION_KEYS.inventoryTileManualCaption)}
        onPress={onAddManually}
      />
    </TileRow>
  );
};
