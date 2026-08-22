import { EQUIPMENT_TYPES, type BrewMethod, type Equipment } from '@brewmate/shared';

import { filterBrewableMethods } from '../services/readOwnedBrewers';

import { useBrewMethodCatalog } from './useBrewMethodCatalog';
import { useEquipmentList } from './useEquipmentList';

const NONE: readonly Equipment[] = [];
const ACTIVE_ONLY = true;

export interface AvailableBrewMethods {
  readonly methods: readonly BrewMethod[];
  readonly brewers: readonly Equipment[];
  readonly isLoading: boolean;
  readonly isError: boolean;
}

/**
 * The methods this user can be offered.
 *
 * The whole point of writing down the cupboard: a recommendation for gear
 * somebody does not own is not advice, it is a shopping list they did not ask
 * for.
 */
export const useAvailableBrewMethods = (): AvailableBrewMethods => {
  const catalog = useBrewMethodCatalog();
  const equipment = useEquipmentList({ type: EQUIPMENT_TYPES.brewer, activeOnly: ACTIVE_ONLY });
  const brewers = equipment.data?.items ?? NONE;

  return {
    brewers,
    methods: filterBrewableMethods(catalog.methods, brewers),
    isLoading: catalog.isLoading || equipment.isPending,
    isError: catalog.isError || equipment.isError,
  };
};
