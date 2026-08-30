import { useRouter } from 'expo-router';
import { useState, type JSX } from 'react';

import { Screen, TileRow } from '../../../../components/layout';
import { QueryState, Text, Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { INVENTORY_TILE_ICONS } from '../../constants';
import { useCoffeeBags } from '../../hooks';
import { AddCoffeeBagSheet } from '../AddCoffeeBagSheet';
import { CoffeeBagGroups } from '../CoffeeBagGroups';
import { InventoryActionTiles } from '../InventoryActionTiles';
import { InventorySummaryStrip } from '../InventorySummaryStrip';

import { InventoryEmpty } from './InventoryEmpty';

const NOTHING = 0;

/**
 * The cupboard, answering "what do I drink this morning" rather than "what did
 * I add last".
 *
 * The shape of the screen is the answer: what the shelf adds up to, the two
 * ways to add to it, and then the bags themselves grouped by what to do with
 * each one. It used to be a flat list in the order the API returned, with
 * three identical grey buttons underneath - which put the ways of filling the
 * cupboard further away the more somebody used it, and buried the one bag
 * worth opening under two that were still resting.
 *
 * The grinder catalogue is last and quiet. It is a reference book about
 * equipment on a screen about coffee, and at the same weight as the actions
 * that fill the shelf it was competing with them for no reason.
 *
 * An empty cupboard is the common case rather than the exception, so it keeps
 * its own screen with real ways out instead of the sentence "žiadne dáta".
 */
export const InventoryScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const bags = useCoffeeBags();
  const [adding, setAdding] = useState(false);
  const items = bags.data?.items ?? [];
  const hasBags = bags.isSuccess && items.length > NOTHING;

  const openForm = (): void => {
    setAdding(true);
  };

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.inventoryTitle)}</Text>
      <QueryState
        isPending={bags.isPending}
        isError={bags.isError}
        error={bags.error}
        onRetry={(): void => {
          void bags.refetch();
        }}
      />
      {hasBags ? <InventorySummaryStrip bags={items} /> : null}
      {bags.isSuccess ? <InventoryActionTiles onAddManually={openForm} /> : null}
      {bags.isSuccess && items.length === NOTHING ? (
        <InventoryEmpty onAddManually={openForm} />
      ) : null}
      {hasBags ? <CoffeeBagGroups bags={items} /> : null}
      <TileRow>
        <Tile
          icon={INVENTORY_TILE_ICONS.grinders}
          title={t(TRANSLATION_KEYS.inventoryTileGrindersTitle)}
          caption={t(TRANSLATION_KEYS.inventoryTileGrindersCaption)}
          onPress={(): void => {
            router.push(ROUTES.grinders);
          }}
        />
      </TileRow>
      <AddCoffeeBagSheet
        visible={adding}
        onClose={(): void => {
          setAdding(false);
        }}
      />
    </Screen>
  );
};
