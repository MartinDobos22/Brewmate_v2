import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { EmptyState } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

export interface InventoryEmptyProps {
  readonly onAddManually: () => void;
}

/**
 * A cupboard nobody has filled in yet.
 *
 * Two clear ways in, and a third for the person who has no coffee at home at
 * all - which is a normal thing to be, and the one case where this app can
 * help immediately rather than after a purchase.
 */
export const InventoryEmpty = ({ onAddManually }: InventoryEmptyProps): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <EmptyState
      title={t(TRANSLATION_KEYS.inventoryEmptyTitle)}
      description={t(TRANSLATION_KEYS.inventoryEmptyBody)}
      actions={[
        {
          label: t(TRANSLATION_KEYS.inventoryAddScan),
          variant: 'primary',
          onPress: (): void => {
            router.push(ROUTES.scan);
          },
        },
        {
          label: t(TRANSLATION_KEYS.inventoryAddManual),
          variant: 'secondary',
          onPress: onAddManually,
        },
        {
          label: t(TRANSLATION_KEYS.inventoryNoCoffeeYet),
          onPress: (): void => {
            router.push(ROUTES.scan);
          },
        },
      ]}
    />
  );
};
