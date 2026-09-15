import { EQUIPMENT_TYPES } from '../enums/equipmentTypes.js';

import type { Equipment } from './equipmentSchema.js';

/** The grinders in a kitchen, in whatever order the gear was listed in. */
export const listGrinderEquipment = (equipment: readonly Equipment[]): readonly Equipment[] =>
  equipment.filter((item: Equipment): boolean => item.type === EQUIPMENT_TYPES.grinder);

/**
 * Which grinder a brew is assumed to be ground on when nobody has said.
 *
 * The catalogued one first, because that is the only one that can answer with
 * a number on a collar - a grinder the catalogue has never met gives a grind
 * in words and nothing else, so preferring it would be choosing the vaguer of
 * two answers. Failing that, the first one they own: owning an uncatalogued
 * grinder and owning none at all are different things to say, and only the
 * second one means the coffee arrives already ground.
 *
 * It lives here rather than on either side of the wire because both sides ask
 * it. The app runs it to draw the starting point before a token is spent and
 * the API runs it again before it writes the recipe, and two copies of a rule
 * this quiet would disagree the first time either one was tidied - leaving one
 * screen showing a band read off a grinder the recipe was not written for.
 */
export const chooseGrinderEquipment = (equipment: readonly Equipment[]): Equipment | null => {
  const grinders = listGrinderEquipment(equipment);

  return (
    grinders.find((item: Equipment): boolean => item.catalogGrinderId !== null) ??
    grinders[0] ??
    null
  );
};
