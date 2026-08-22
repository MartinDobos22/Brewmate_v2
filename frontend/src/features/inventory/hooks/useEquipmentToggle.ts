import type { Equipment, EquipmentType, JsonObject } from '@brewmate/shared';

import { useCreateEquipment } from './useCreateEquipment';
import { useDeleteEquipment } from './useDeleteEquipment';
import { useEquipmentList } from './useEquipmentList';
import { useUpdateEquipment } from './useUpdateEquipment';

const FIRST = 0;

export interface EquipmentToggle {
  /** The one piece of this kind the user owns, if any. */
  readonly item: Equipment | undefined;
  readonly isLoading: boolean;
  readonly isPending: boolean;
  readonly setPresent: (params: JsonObject) => void;
  readonly setAbsent: () => void;
}

/**
 * A kind of gear the user either has or does not: a scale, a kettle.
 *
 * Modelled as one row rather than a boolean on the account, because it is the
 * same `equipment` a set can name and a recipe can be written for - and
 * because a kettle carries the one property that changes the advice.
 */
export const useEquipmentToggle = (type: EquipmentType): EquipmentToggle => {
  const query = useEquipmentList({ type });
  const create = useCreateEquipment();
  const update = useUpdateEquipment();
  const remove = useDeleteEquipment();
  const item = query.data?.items[FIRST];

  return {
    item,
    isLoading: query.isPending,
    isPending: create.isPending || update.isPending || remove.isPending,

    setPresent: (params: JsonObject): void => {
      if (item === undefined) {
        create.mutate({ type, params });

        return;
      }

      update.mutate({ id: item.id, changes: { params } });
    },

    setAbsent: (): void => {
      if (item !== undefined) {
        remove.mutate(item.id);
      }
    },
  };
};
