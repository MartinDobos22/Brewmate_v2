import { useRouter } from 'expo-router';
import { useState, type JSX } from 'react';

import { View } from 'react-native';

import { Screen } from '../../../../components/layout';
import { ActionRow, QueryState } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { INVENTORY_TILE_ICONS } from '../../constants';
import { useCoffeeBags } from '../../hooks';
import { AddCoffeeBagSheet } from '../AddCoffeeBagSheet';
import { CoffeeBagGroups } from '../CoffeeBagGroups';
import { InventoryHeader } from '../InventoryHeader';
import { InventorySummaryStrip } from '../InventorySummaryStrip';

import { InventoryEmpty } from './InventoryEmpty';
import { createInventoryScreenStyles } from './InventoryScreen.styles';

const NOTHING = 0;

/**
 * The cupboard, answering "what do I drink this morning" rather than "what did
 * I add last".
 *
 * The shape of the screen is the answer: what the shelf adds up to, then the
 * bags themselves grouped by what to do with each one. The two ways to add a
 * coffee moved into the title row, so they are in the same place whether
 * somebody owns one bag or nine - as tiles under the summary they got further
 * away the more the app was used.
 *
 * The grinder catalogue is last and quiet, as a row rather than a tile. It is
 * a reference book about equipment on a screen about coffee, and at the weight
 * of the things that fill the shelf it was competing with them for no reason.
 *
 * An empty cupboard is the common case rather than the exception, so it keeps
 * its own screen with real ways out instead of the sentence "žiadne dáta".
 */
export const InventoryScreen = (): JSX.Element => {
  const styles = useThemedStyles(createInventoryScreenStyles);
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
    <Screen scrollable padded={false}>
      <View style={styles.content}>
        <InventoryHeader onAddManually={openForm} />
        <QueryState
          isPending={bags.isPending}
          isError={bags.isError}
          error={bags.error}
          onRetry={(): void => {
            void bags.refetch();
          }}
        />
        {hasBags ? <InventorySummaryStrip bags={items} /> : null}
        {bags.isSuccess && items.length === NOTHING ? (
          <InventoryEmpty onAddManually={openForm} />
        ) : null}
        {hasBags ? <CoffeeBagGroups bags={items} /> : null}
        {bags.isSuccess ? (
          <ActionRow
            icon={INVENTORY_TILE_ICONS.grinders}
            title={t(TRANSLATION_KEYS.inventoryTileGrindersTitle)}
            caption={t(TRANSLATION_KEYS.inventoryTileGrindersCaption)}
            onPress={(): void => {
              router.push(ROUTES.grinders);
            }}
          />
        ) : null}
      </View>
      <AddCoffeeBagSheet
        visible={adding}
        onClose={(): void => {
          setAdding(false);
        }}
      />
    </Screen>
  );
};
