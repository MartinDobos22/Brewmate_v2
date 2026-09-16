import {
  EQUIPMENT_TYPES,
  type BrewMethod,
  type Equipment,
  type EquipmentSet,
} from '@brewmate/shared';

import { useBrewMethodCatalog } from './useBrewMethodCatalog';
import { useEquipmentList } from './useEquipmentList';

const NONE: readonly Equipment[] = [];
const ACTIVE_ONLY = true;

export interface AvailableBrewMethods {
  /** The whole active catalogue, whatever the cupboard holds. */
  readonly methods: readonly BrewMethod[];
  readonly brewers: readonly Equipment[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  /** Whichever of the two queries failed, tried again together. */
  readonly error: unknown;
  readonly refetch: () => void;
}

/**
 * The methods this user can be offered - which is all of them.
 *
 * Brewmate used to hide any method nothing in the cupboard pointed at. That
 * reads as helpful and behaves as a trap: a cupboard nobody has filled in is
 * indistinguishable from a cupboard with nothing in it, so the one person who
 * most needs a suggestion is shown a single method and no way to reach the
 * rest. Somebody standing over a dripper knows they own it better than the
 * inventory does.
 *
 * The cupboard still decides the *figures*: `brewers`, narrowed to the active
 * set, is where a capacity or a basket size comes from. Not owning the brewer
 * costs those numbers, not the method.
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
    methods: catalog.methods,
    isLoading: catalog.isLoading || equipment.isPending,
    isError: catalog.isError || equipment.isError,
    error: equipment.error ?? catalog.error,
    refetch: (): void => {
      catalog.refetch();
      void equipment.refetch();
    },
  };
};
