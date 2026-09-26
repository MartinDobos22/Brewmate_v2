import type { TileGlyph } from '../../../components/ui';

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

/**
 * Where "späť" leads from inside a quick brew: the stage before, which is the
 * screen somebody was just on. The method has nothing behind it, and neither
 * does the bag that was just written into the cupboard.
 */
export const QUICK_BREW_PREVIOUS_STAGES: Partial<Record<QuickBrewStage, QuickBrewStage>> = {
  [QUICK_BREW_STAGES.coffee]: QUICK_BREW_STAGES.method,
  [QUICK_BREW_STAGES.recipe]: QUICK_BREW_STAGES.coffee,
};

/**
 * The mark the quick brew wears at the top of itself.
 *
 * The same bolt the home screen's own round button into this flow carries, so
 * pressing one and arriving at the other is recognisably the same errand -
 * the rule the scanner's badge and the import's already follow.
 */
export const QUICK_BREW_ICONS = {
  flow: 'lightning-bolt-outline',
} as const satisfies Record<string, TileGlyph>;
