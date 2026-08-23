import type { JSX } from 'react';

import { Sheet } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

import { AddCoffeeBagForm } from './AddCoffeeBagForm';

export interface AddCoffeeBagSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** "Zadať ručne", without leaving the cupboard to do it. */
export const AddCoffeeBagSheet = ({ visible, onClose }: AddCoffeeBagSheetProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Sheet
      visible={visible}
      title={t(TRANSLATION_KEYS.inventoryAddTitle)}
      closeLabel={t(TRANSLATION_KEYS.actionClose)}
      onClose={onClose}
    >
      <AddCoffeeBagForm onAdded={onClose} />
    </Sheet>
  );
};
