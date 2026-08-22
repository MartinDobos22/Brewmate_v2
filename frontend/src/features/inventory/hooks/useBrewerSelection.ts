import { EQUIPMENT_TYPES, type BrewMethod, type Equipment } from '@brewmate/shared';

import { findBrewerForMethod } from '../services/readOwnedBrewers';

import { useAvailableBrewMethods } from './useAvailableBrewMethods';
import { useBrewMethodCatalog } from './useBrewMethodCatalog';
import { useCreateEquipment } from './useCreateEquipment';
import { useDeleteEquipment } from './useDeleteEquipment';

export interface BrewerSelection {
  /** Every method that needs a brewer, whether or not this user owns one. */
  readonly methods: readonly BrewMethod[];
  readonly selectedCount: number;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isPending: boolean;
  readonly brewerFor: (method: BrewMethod) => Equipment | undefined;
  readonly toggle: (method: BrewMethod) => void;
}

/**
 * Owning a brewer, expressed as ticking a method.
 *
 * Nobody thinks of a V60 as "a piece of equipment of type brewer with a method
 * id"; they think of it as the thing they make coffee in. So the screen offers
 * methods, and each tick writes or removes the row behind it.
 */
export const useBrewerSelection = (): BrewerSelection => {
  const catalog = useBrewMethodCatalog();
  const owned = useAvailableBrewMethods();
  const create = useCreateEquipment();
  const remove = useDeleteEquipment();

  const methods = catalog.methods.filter(
    (method: BrewMethod): boolean => method.requiresEquipmentType === EQUIPMENT_TYPES.brewer,
  );

  const brewerFor = (method: BrewMethod): Equipment | undefined =>
    findBrewerForMethod(owned.brewers, method.id);

  return {
    methods,
    brewerFor,
    selectedCount: owned.brewers.length,
    isLoading: catalog.isLoading || owned.isLoading,
    isError: catalog.isError || owned.isError,
    isPending: create.isPending || remove.isPending,

    toggle: (method: BrewMethod): void => {
      const existing = brewerFor(method);

      if (existing === undefined) {
        create.mutate({
          type: EQUIPMENT_TYPES.brewer,
          model: method.nameSk,
          params: { methodId: method.id },
        });

        return;
      }

      remove.mutate(existing.id);
    },
  };
};
