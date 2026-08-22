import type { JSX } from 'react';

import type { Grinder } from '@brewmate/shared';

import { Sheet } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { AddGrinderForm } from '../AddGrinderForm';

export interface AddGrinderSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onAdded: (grinder: Grinder) => void;
}

/** The way out of "nenašiel som svoj mlynček", without leaving the catalogue. */
export const AddGrinderSheet = ({
  visible,
  onClose,
  onAdded,
}: AddGrinderSheetProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Sheet
      visible={visible}
      title={t(TRANSLATION_KEYS.grinderAddTitle)}
      closeLabel={t(TRANSLATION_KEYS.actionClose)}
      onClose={onClose}
    >
      <AddGrinderForm onAdded={onAdded} />
    </Sheet>
  );
};
