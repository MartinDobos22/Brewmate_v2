import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { useBrewStats, useInventorySummary } from '../../hooks';
import { InventoryTile } from '../InventoryTile';
import { StatsTile } from '../StatsTile';

const NOTHING = 0;

/**
 * The two tiles that report rather than invite, and the one row that is
 * allowed to be absent.
 *
 * An account with no coffee and no brewing behind it would get two frames
 * containing nothing, and a dashboard of empty frames is the worst first
 * impression this product could make - it is the reason the home screen is
 * built the way it is. So the row appears the moment there is anything to
 * report and stays for good afterwards.
 */
export const HomeDataRow = (): JSX.Element | null => {
  const inventory = useInventorySummary();
  const brews = useBrewStats();

  if (!inventory.isReady || !brews.isReady) {
    return null;
  }

  if (inventory.bagCount === NOTHING && !brews.hasBrewed) {
    return null;
  }

  return (
    <TileRow>
      <InventoryTile />
      <StatsTile />
    </TileRow>
  );
};
