import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import type { EquipmentSetFormValues } from '../services/equipmentSetForm';

/** A blank set: named by the user, combining nothing until they pick something. */
export const EMPTY_EQUIPMENT_SET_FORM: EquipmentSetFormValues = {
  name: '',
  equipmentIds: [],
  isDefault: false,
  constraints: {},
};

/**
 * The four places people actually brew in, offered as one tap each.
 *
 * Suggestions rather than fixed options: somebody's third place is their
 * office kitchen or their parents' house, and the field stays free text.
 */
export const EQUIPMENT_SET_NAME_SUGGESTION_KEYS: readonly TranslationKey[] = [
  TRANSLATION_KEYS.setupSetsSuggestionHome,
  TRANSLATION_KEYS.setupSetsSuggestionCabin,
  TRANSLATION_KEYS.setupSetsSuggestionWork,
  TRANSLATION_KEYS.setupSetsSuggestionFriend,
];
