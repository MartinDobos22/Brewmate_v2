import { useMemo } from 'react';
import {
  EQUIPMENT_TYPES,
  readGrindCoffeeFacts,
  resolveGrindGuidance,
  type BrewMethod,
  type CoffeeBag,
  type Equipment,
  type EquipmentSet,
  type GrindGuidance,
} from '@brewmate/shared';

import { useEquipmentList, useGrinder } from '../../inventory/hooks';

const NONE: readonly Equipment[] = [];
const ACTIVE_ONLY = true;

export interface GrindGuidanceReading {
  /** Null only until a method has been chosen; every other gap is inside the guidance. */
  readonly guidance: GrindGuidance | null;
  /** What to call the grinder the numbers were read off, where there is one. */
  readonly grinderName: string | null;
  /** Whether they own a grinder at all, which is a different gap from owning an uncatalogued one. */
  readonly hasGrinder: boolean;
  readonly isLoading: boolean;
}

const nameOf = (grinder: { readonly brand: string; readonly model: string }): string =>
  `${grinder.brand} ${grinder.model}`;

/**
 * Where to put the collar for this coffee in this brewer, before a single
 * token is spent.
 *
 * The arithmetic is the same function the API runs before it writes a recipe,
 * imported from `@brewmate/shared` rather than reimplemented - two answers to
 * "where do I start" would eventually disagree with each other on the same
 * screen, and the one somebody trusts is whichever they read first.
 *
 * Running it here costs nothing and needs no connection, which is the point.
 * A cafe opening a new bag wants the starting point now, several times a
 * morning, and a number that arrived after a request and a spinner is a number
 * they would stop waiting for by the third bag.
 *
 * The grinder is read out of the same set the rest of the screen is narrowed
 * by: the grinder at the cabin is the one grinding this coffee, whatever is
 * sitting on the counter at home.
 */
export const useGrindGuidance = (
  method: BrewMethod | undefined,
  bag: CoffeeBag | null,
  equipmentSet: EquipmentSet | undefined,
): GrindGuidanceReading => {
  const equipment = useEquipmentList({ type: EQUIPMENT_TYPES.grinder, activeOnly: ACTIVE_ONLY });
  const owned = equipment.data?.items ?? NONE;
  const inSet =
    equipmentSet === undefined
      ? owned
      : owned.filter((item: Equipment): boolean => equipmentSet.equipmentIds.includes(item.id));
  /**
   * The first one linked to the catalogue, falling back to the first one they
   * own. A grinder with no catalogue entry still means they have a grinder -
   * "you own nothing to grind with" and "I do not know your grinder's scale"
   * are different things to say, and the second one has a fix.
   */
  const linked = inSet.find((item: Equipment): boolean => item.catalogGrinderId !== null);
  const chosen = linked ?? inSet[0];
  const catalogue = useGrinder(linked?.catalogGrinderId ?? null);
  const grinder = catalogue.data ?? null;
  const category = method?.category;

  const guidance = useMemo(
    (): GrindGuidance | null =>
      category === undefined
        ? null
        : resolveGrindGuidance({
            methodCategory: category,
            coffee: readGrindCoffeeFacts(bag, new Date()),
            grinder,
          }),
    [category, bag, grinder],
  );

  return {
    guidance,
    grinderName: grinder === null ? (chosen?.brand ?? null) : nameOf(grinder),
    hasGrinder: chosen !== undefined,
    /*
     * A disabled query never leaves `isPending`, so waiting on one would mean
     * waiting forever for somebody who has no catalogued grinder at all.
     */
    isLoading: equipment.isPending || (linked !== undefined && catalogue.isPending),
  };
};
