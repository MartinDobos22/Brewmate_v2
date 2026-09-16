import { EQUIPMENT_TYPES, type Equipment, type Grinder } from '@brewmate/shared';

import { useCreateEquipment } from './useCreateEquipment';
import { useDeleteEquipment } from './useDeleteEquipment';
import { useEquipmentList } from './useEquipmentList';

const NONE: readonly Equipment[] = [];

export interface GrinderInventory {
  readonly owned: readonly Equipment[];
  readonly isLoading: boolean;
  readonly isPending: boolean;
  /**
   * Writes a catalogue entry into the cupboard.
   *
   * The callback exists because the row that comes back is the only thing that
   * can be pointed at afterwards: somebody adding a grinder from the brewing
   * screen is adding it in order to grind with it now, and handing them back a
   * list to find it in would be the app making them answer twice.
   */
  readonly add: (grinder: Grinder, onAdded?: (equipment: Equipment) => void) => void;
  readonly remove: (equipmentId: string) => void;
}

/**
 * The grinders somebody owns, as opposed to the ones in the catalogue.
 *
 * Adding one copies the brand and the model onto the row and keeps
 * `catalogGrinderId` pointing at the entry it came from: the copy is what a
 * list shows after the catalogue entry is edited, and the link is what makes
 * a setting translatable into microns.
 */
export const useGrinderInventory = (): GrinderInventory => {
  const query = useEquipmentList({ type: EQUIPMENT_TYPES.grinder });
  const create = useCreateEquipment();
  const remove = useDeleteEquipment();

  return {
    owned: query.data?.items ?? NONE,
    isLoading: query.isPending,
    isPending: create.isPending || remove.isPending,

    add: (grinder: Grinder, onAdded?: (equipment: Equipment) => void): void => {
      create.mutate(
        {
          type: EQUIPMENT_TYPES.grinder,
          catalogGrinderId: grinder.id,
          brand: grinder.brand,
          model: grinder.model,
        },
        { onSuccess: onAdded },
      );
    },

    remove: (equipmentId: string): void => {
      remove.mutate(equipmentId);
    },
  };
};
