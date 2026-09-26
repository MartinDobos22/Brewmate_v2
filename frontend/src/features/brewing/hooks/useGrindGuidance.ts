import { useMemo } from 'react';
import {
  EQUIPMENT_TYPES,
  chooseGrinderEquipment,
  findGrindHabitShift,
  readGrindCoffeeFacts,
  resolveGrindGuidance,
  type BrewMethod,
  type CoffeeBag,
  type Equipment,
  type EquipmentSet,
  type GrindGuidance,
} from '@brewmate/shared';

import { useEquipmentList, useGrinder } from '../../inventory/hooks';
import { resolveGrinderCandidates } from '../services/resolveGrinderCandidates';

import { useBrewingProfile } from './useBrewingProfile';

const NONE: readonly Equipment[] = [];
const ACTIVE_ONLY = true;

export interface GrindGuidanceReading {
  /** Null only until a method has been chosen; every other gap is inside the guidance. */
  readonly guidance: GrindGuidance | null;
  /**
   * Every grinder this brew could be ground on, which is what makes the
   * choice askable at all.
   *
   * Narrowed by `resolveGrinderCandidates`, which owns the two rules that stop
   * the narrowing from emptying the list: a set naming no grinder is not a
   * claim that there is nothing to grind with, and a grinder picked on this
   * screen outranks a set saved months ago.
   */
  readonly candidates: readonly Equipment[];
  /** The one the numbers below were read off, chosen or defaulted to. */
  readonly chosenId: string | null;
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
 * Which grinder it is read off is now an answer rather than an accident. A
 * kitchen with a hand grinder and an electric one has two right answers, and
 * the difference between them is the whole number: a click is ten microns on
 * one and forty on the other. Nobody having said is still the common case, and
 * `chooseGrinderEquipment` - the same rule the API falls back to - settles it
 * the same way on both sides of the wire.
 *
 * The habit comes in the same way the API reads it - the brewing profile's
 * grind shift for this family, through `findGrindHabitShift` - so the band
 * drawn here and the band the recipe is written from are moved by the same
 * amount, and the reasons under it say so.
 */
export const useGrindGuidance = (
  method: BrewMethod | undefined,
  bag: CoffeeBag | null,
  equipmentSet: EquipmentSet | undefined,
  chosenGrinderId: string | null,
): GrindGuidanceReading => {
  const equipment = useEquipmentList({ type: EQUIPMENT_TYPES.grinder, activeOnly: ACTIVE_ONLY });
  const owned = equipment.data?.items ?? NONE;
  const candidates = resolveGrinderCandidates({
    owned,
    equipmentSet,
    chosenId: chosenGrinderId,
  });
  /**
   * What they picked, or what the shared rule picks for them.
   *
   * A pick that is no longer among the candidates - the set was switched after
   * it was made - falls back rather than leaving the card blank: the choice
   * belongs to a kitchen, and this is a different one.
   */
  const chosen =
    candidates.find((item: Equipment): boolean => item.id === chosenGrinderId) ??
    chooseGrinderEquipment(candidates);
  const catalogue = useGrinder(chosen?.catalogGrinderId ?? null);
  const grinder = catalogue.data ?? null;
  const category = method?.category;
  const habitShift = findGrindHabitShift(useBrewingProfile().data, category);

  const guidance = useMemo(
    (): GrindGuidance | null =>
      category === undefined
        ? null
        : resolveGrindGuidance({
            methodCategory: category,
            coffee: readGrindCoffeeFacts(bag, new Date()),
            grinder,
            habitShift,
          }),
    [category, bag, grinder, habitShift],
  );

  return {
    guidance,
    candidates,
    chosenId: chosen?.id ?? null,
    grinderName: grinder === null ? (chosen?.brand ?? null) : nameOf(grinder),
    hasGrinder: chosen !== null,
    /*
     * A disabled query never leaves `isPending`, so waiting on one would mean
     * waiting forever for somebody who has no catalogued grinder at all.
     */
    isLoading:
      equipment.isPending || ((chosen?.catalogGrinderId ?? null) !== null && catalogue.isPending),
  };
};
