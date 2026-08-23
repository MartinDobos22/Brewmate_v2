import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export interface RecipeNoteInput {
  readonly hasTemperatureControl: boolean;
  readonly hasScale: boolean;
}

/**
 * Which caveats one recipe needs.
 *
 * A note is added only where the gear makes the number above unreachable, so
 * the card stays short. Three permanent notes under every recipe are three
 * notes nobody reads.
 */
export const buildRecipeNoteKeys = ({
  hasTemperatureControl,
  hasScale,
}: RecipeNoteInput): readonly TranslationKey[] => [
  TRANSLATION_KEYS.recipeGrindNote,
  ...(hasTemperatureControl ? [] : [TRANSLATION_KEYS.recipeNoTemperatureNote]),
  ...(hasScale ? [] : [TRANSLATION_KEYS.recipeNoScaleNote]),
];
