import type { TileGlyph } from '../../../components/ui';

/**
 * Where a coffee comes from, asked before anything else about the brew.
 *
 * No default, because the answers are genuinely different acts and none is
 * rare. A bag already in the cupboard is a choice from a list; a bag that is
 * not is a photograph - taken now or already on the phone - or a label typed
 * in. Starting on the list - which is what this screen used to do - made the
 * second case look like an omission somebody had to fix before they were
 * allowed to make coffee.
 *
 * `photo` is only reached by a photograph that was refused: the camera and the
 * library open straight from the question, and the card is where the reasons
 * are printed above the button that retakes it.
 */
export const COFFEE_SOURCE_STAGES = {
  choice: 'choice',
  inventory: 'inventory',
  photo: 'photo',
  label: 'label',
} as const;

export type CoffeeSourceStage = (typeof COFFEE_SOURCE_STAGES)[keyof typeof COFFEE_SOURCE_STAGES];

/**
 * The glyphs the four tiles carry.
 *
 * The cupboard's is the one the inventory tab is already marked with, because
 * it leads to the same coffees; a second picture for the same thing would read
 * as a second thing. The library and the pencil are the scanner's own, for the
 * same reason.
 */
export const COFFEE_SOURCE_ICONS: Record<'photo' | 'library' | 'inventory' | 'manual', TileGlyph> =
  {
    photo: 'camera-outline',
    library: 'image-outline',
    inventory: 'package-variant-closed',
    manual: 'pencil-outline',
  };
