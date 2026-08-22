import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { EmptyState } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/**
 * Still a placeholder for the cupboard itself, but the grinder catalogue is
 * real, and this is the screen it belongs behind.
 */
export const InventoryScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen>
      <EmptyState
        title={t(TRANSLATION_KEYS.inventoryEmptyTitle)}
        description={t(TRANSLATION_KEYS.inventoryEmptyBody)}
        actionLabel={t(TRANSLATION_KEYS.grinderCatalogTitle)}
        onAction={(): void => {
          router.push(ROUTES.grinders);
        }}
      />
    </Screen>
  );
};
