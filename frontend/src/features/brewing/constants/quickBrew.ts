/**
 * Where somebody is inside a quick brew.
 *
 * `coffee` is the step that makes the whole flow worth having: it accepts
 * everything, including nothing at all. Nobody wants to fill in a database
 * before they are allowed to make a cup of coffee.
 */
export const QUICK_BREW_STAGES = {
  method: 'method',
  coffee: 'coffee',
  recipe: 'recipe',
  saved: 'saved',
} as const;

export type QuickBrewStage = (typeof QUICK_BREW_STAGES)[keyof typeof QUICK_BREW_STAGES];
