import type { TileGlyph } from '../../../components/ui';

/**
 * Where a coffee comes from, asked before anything else about the brew.
 *
 * Two answers and no default, because they are genuinely different acts and
 * neither is rare. A bag already in the cupboard is a choice from a list; a
 * bag that is not is a photograph. Starting on the list - which is what this
 * screen used to do - made the second case look like an omission somebody had
 * to fix before they were allowed to make coffee.
 */
export const COFFEE_SOURCE_STAGES = {
  choice: 'choice',
  inventory: 'inventory',
  photo: 'photo',
  label: 'label',
} as const;

export type CoffeeSourceStage = (typeof COFFEE_SOURCE_STAGES)[keyof typeof COFFEE_SOURCE_STAGES];

/**
 * The glyphs the two tiles carry.
 *
 * The cupboard's is the one the inventory tab is already marked with, because
 * it leads to the same coffees; a second picture for the same thing would read
 * as a second thing.
 */
export const COFFEE_SOURCE_ICONS: Record<'photo' | 'inventory', TileGlyph> = {
  photo: 'camera-outline',
  inventory: 'package-variant-closed',
};
