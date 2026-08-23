import { useRouter } from 'expo-router';
import { useState, type JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Button, QueryState, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useCoffeeBags } from '../../hooks';
import { AddCoffeeBagSheet } from '../AddCoffeeBagSheet';
import { CoffeeBagList } from '../CoffeeBagList';

import { InventoryEmpty } from './InventoryEmpty';

const NOTHING = 0;

/**
 * The cupboard, and the two ways to fill it.
 *
 * An empty one is the common case rather than the exception, so it gets a real
 * screen with real actions instead of the sentence "žiadne dáta".
 */
export const InventoryScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const bags = useCoffeeBags();
  const [adding, setAdding] = useState(false);
  const items = bags.data?.items ?? [];

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
      {bags.isSuccess && items.length === NOTHING ? (
        <InventoryEmpty onAddManually={openForm} />
      ) : null}
      {bags.isSuccess && items.length > NOTHING ? (
        <>
          <CoffeeBagList bags={items} />
          <Button
            label={t(TRANSLATION_KEYS.inventoryAddManual)}
            variant="secondary"
            fullWidth
            onPress={openForm}
          />
          <Button
            label={t(TRANSLATION_KEYS.inventoryAddScan)}
            variant="tertiary"
            fullWidth
            onPress={(): void => {
              router.push(ROUTES.scan);
            }}
          />
        </>
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.inventoryOpenGrinders)}
        variant="tertiary"
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.grinders);
        }}
      />
      <AddCoffeeBagSheet
        visible={adding}
        onClose={(): void => {
          setAdding(false);
        }}
      />
    </Screen>
  );
};
