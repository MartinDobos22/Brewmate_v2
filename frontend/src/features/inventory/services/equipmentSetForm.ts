import type {
  BrewConstraintName,
  BrewConstraints,
  CreateEquipmentSetRequest,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

const EMPTY = '';
const NOTHING = 0;

/** A set as it is being filled in. */
export interface EquipmentSetFormValues {
  readonly name: string;
  readonly equipmentIds: readonly string[];
  readonly isDefault: boolean;
  readonly constraints: BrewConstraints;
}

/** Adds an id, or takes it out again. Order is preserved, because a set has one. */
export const toggleEquipmentId = (
  equipmentIds: readonly string[],
  equipmentId: string,
): readonly string[] =>
  equipmentIds.includes(equipmentId)
    ? equipmentIds.filter((current: string): boolean => current !== equipmentId)
    : [...equipmentIds, equipmentId];

/** Raises a flag, or lowers it. A lowered flag is removed rather than set false. */
export const toggleConstraint = (
  constraints: BrewConstraints,
  flag: BrewConstraintName,
): BrewConstraints => {
  const { [flag]: current, ...rest } = constraints;

  return current === true ? rest : { ...rest, [flag]: true };
};

/**
 * The one thing that can be wrong: a set with no name, or one that combines
 * nothing. Everything else about a set is optional by design.
 */
export const validateEquipmentSetForm = (values: EquipmentSetFormValues): TranslationKey | null => {
  if (values.name.trim() === EMPTY) {
    return TRANSLATION_KEYS.setupSetsErrorNameRequired;
  }

  return values.equipmentIds.length === NOTHING
    ? TRANSLATION_KEYS.setupSetsErrorItemsRequired
    : null;
};

export const toCreateEquipmentSetRequest = (
  values: EquipmentSetFormValues,
): CreateEquipmentSetRequest => ({
  name: values.name.trim(),
  equipmentIds: [...values.equipmentIds],
  defaultConstraints: values.constraints,
  isDefault: values.isDefault,
});
