/**
 * What a recorded model call was for.
 *
 * These strings end up in `ai_usage_logs.function_name`, which is what a month
 * of spending is grouped by. Renaming one splits the history in two, so they
 * are written down here rather than at the call sites.
 */
export const AI_FUNCTION_NAMES = {
  parseCoffeeBag: 'parse-coffee-bag',
  evaluateCoffee: 'evaluate-coffee',
  generateRecipe: 'generate-recipe',
  recipeChat: 'recipe-chat',
  parseRecipe: 'parse-recipe',
  convertRecipe: 'convert-recipe',
  espressoDialIn: 'espresso-dial-in',
  tuneProfile: 'tune-profile',
} as const;

export type AiFunctionName = (typeof AI_FUNCTION_NAMES)[keyof typeof AI_FUNCTION_NAMES];
