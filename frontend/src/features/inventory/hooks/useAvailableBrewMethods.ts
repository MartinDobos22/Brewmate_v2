import {
  EQUIPMENT_TYPES,
  type BrewMethod,
  type Equipment,
  type EquipmentSet,
} from '@brewmate/shared';

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
  /** Whichever of the two queries failed, tried again together. */
  readonly error: unknown;
  readonly refetch: () => void;
}

/**
 * The methods this user can be offered.
 *
 * The whole point of writing down the cupboard: a recommendation for gear
 * somebody does not own is not advice, it is a shopping list they did not ask
 * for.
 *
 * Narrowed to one set where a set is given, because that is what switching to
 * "Chata" means: the dripper is at home, so the methods it makes possible are
 * at home too. Without a set the answer is everything still owned - somebody
 * who has never made a set has not thereby lost their kettle.
 */
export const useAvailableBrewMethods = (equipmentSet?: EquipmentSet): AvailableBrewMethods => {
  const catalog = useBrewMethodCatalog();
  const equipment = useEquipmentList({ type: EQUIPMENT_TYPES.brewer, activeOnly: ACTIVE_ONLY });
  const owned = equipment.data?.items ?? NONE;
  const brewers =
    equipmentSet === undefined
      ? owned
      : owned.filter((brewer: Equipment): boolean => equipmentSet.equipmentIds.includes(brewer.id));

  return {
    brewers,
    methods: filterBrewableMethods(catalog.methods, brewers),
    isLoading: catalog.isLoading || equipment.isPending,
    isError: catalog.isError || equipment.isError,
    error: equipment.error ?? catalog.error,
    refetch: (): void => {
      catalog.refetch();
      void equipment.refetch();
    },
  };
};
