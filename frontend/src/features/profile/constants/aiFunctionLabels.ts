import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The Slovak name of each thing this app asks a model.
 *
 * Keyed by the same strings `ai_usage_logs.function_name` stores, because that
 * column is what a month of spending is grouped by. A name the app has no word
 * for is printed as "ostatné" rather than as a machine name: this list is
 * server-side data, and a function added to the API must not put
 * `espresso-dial-in` on somebody's screen.
 */
export const AI_FUNCTION_LABEL_KEYS: Readonly<Record<string, TranslationKey>> = {
  'parse-coffee-bag': TRANSLATION_KEYS.aiCostsFunctionParseCoffeeBag,
  'evaluate-coffee': TRANSLATION_KEYS.aiCostsFunctionEvaluateCoffee,
  'generate-recipe': TRANSLATION_KEYS.aiCostsFunctionGenerateRecipe,
  'recipe-chat': TRANSLATION_KEYS.aiCostsFunctionRecipeChat,
  'parse-recipe': TRANSLATION_KEYS.aiCostsFunctionParseRecipe,
  'convert-recipe': TRANSLATION_KEYS.aiCostsFunctionConvertRecipe,
  'espresso-dial-in': TRANSLATION_KEYS.aiCostsFunctionEspressoDialIn,
  'tune-profile': TRANSLATION_KEYS.aiCostsFunctionTuneProfile,
};

export const resolveAiFunctionLabelKey = (functionName: string): TranslationKey =>
  AI_FUNCTION_LABEL_KEYS[functionName] ?? TRANSLATION_KEYS.aiCostsFunctionUnknown;
