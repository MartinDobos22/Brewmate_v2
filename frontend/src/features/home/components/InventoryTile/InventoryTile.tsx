import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { HOME_TILE_ICONS } from '../../constants';
import { useInventorySummary } from '../../hooks';

import { BagFreshnessStrip } from './BagFreshnessStrip';
import { InventoryAmount } from './InventoryAmount';

const NOTHING = 0;

/**
 * The cupboard, reported rather than listed.
 *
 * Two facts, which are the two anybody actually wants from across the kitchen:
 * how much coffee is left, and what state it is in. Both are read off the bags
 * themselves, so the tile cannot disagree with the screen it leads to.
 */
export const InventoryTile = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const inventory = useInventorySummary();

  return (
    <Tile
      icon={HOME_TILE_ICONS.inventory}
      title={t(TRANSLATION_KEYS.homeTileInventoryTitle)}
      caption={
        inventory.bagCount === NOTHING
          ? t(TRANSLATION_KEYS.homeTileInventoryEmpty)
          : t(TRANSLATION_KEYS.homeTileInventoryCaption, {
              bags: inventory.bagCount,
              ready: inventory.readyCount,
            })
      }
      onPress={(): void => {
        router.push(ROUTES.inventory);
      }}
    >
      <InventoryAmount grams={inventory.remainingGrams} />
      <BagFreshnessStrip freshness={inventory.freshness} />
    </Tile>
  );
};
