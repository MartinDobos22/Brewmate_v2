import type { Equipment, EquipmentSet } from '@brewmate/shared';

const NOTHING = 0;

export interface GrinderCandidateInput {
  /** Every grinder the account owns, before the place is taken into account. */
  readonly owned: readonly Equipment[];
  readonly equipmentSet: EquipmentSet | undefined;
  /** The pick to keep visible even where the set does not name it. */
  readonly chosenId: string | null;
}

/**
 * Which grinders this brew could be ground on.
 *
 * Narrowed to the active set for the same reason the method list is: the
 * grinder at the cabin is the one grinding this coffee, whatever is sitting on
 * the counter at home.
 *
 * Two things stop that narrowing from emptying the list, and both were states
 * somebody could get stuck in. A set that names no grinder at all is not a
 * claim that there is nothing to grind with - most sets are made to say which
 * brewer is where - so it falls back to everything owned rather than leaving
 * the one card that needs a grinder with nothing to choose from. And a grinder
 * picked on this screen stays in the list even where the set has never heard
 * of it: somebody who has just written down the machine in front of them is
 * holding better evidence about this morning than a set they saved in June.
 */
export const resolveGrinderCandidates = ({
  owned,
  equipmentSet,
  chosenId,
}: GrinderCandidateInput): readonly Equipment[] => {
  if (equipmentSet === undefined) {
    return owned;
  }

  const inSet = owned.filter((item: Equipment): boolean =>
    equipmentSet.equipmentIds.includes(item.id),
  );

  if (inSet.length === NOTHING) {
    return owned;
  }

  const chosen = owned.find((item: Equipment): boolean => item.id === chosenId);

  return chosen === undefined || inSet.includes(chosen) ? inSet : [...inSet, chosen];
};
