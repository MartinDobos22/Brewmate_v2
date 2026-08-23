import type { EquipmentSet } from '@brewmate/shared';

import { useEquipmentSets } from './useEquipmentSets';
import { useUpdateEquipmentSet } from './useUpdateEquipmentSet';

const NONE: readonly EquipmentSet[] = [];
const IS_DEFAULT = true;

export interface EquipmentSetSwitch {
  readonly sets: readonly EquipmentSet[];
  readonly defaultSet: EquipmentSet | undefined;
  readonly isLoading: boolean;
  readonly isPending: boolean;
  readonly makeDefault: (setId: string) => void;
}

/**
 * The saved combinations, and the one tap that switches between them.
 *
 * Marking a set as default is the whole gesture: the API releases whichever
 * set held the flag, so "kde dnes varím" is answered by pressing the place
 * rather than by editing anything.
 */
export const useEquipmentSetSwitcher = (): EquipmentSetSwitch => {
  const query = useEquipmentSets();
  const update = useUpdateEquipmentSet();
  const sets = query.data?.items ?? NONE;

  return {
    sets,
    defaultSet: sets.find((set: EquipmentSet): boolean => set.isDefault),
    isLoading: query.isPending,
    isPending: update.isPending,

    makeDefault: (setId: string): void => {
      update.mutate({ id: setId, changes: { isDefault: IS_DEFAULT } });
    },
  };
};
