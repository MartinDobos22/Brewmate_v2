import type { TileGlyph } from '../Tile';

/**
 * The eye on a masked field, and the eye with a line through it.
 *
 * Named here rather than in the auth feature because the field that draws
 * them is shared: any form in the app can ask for a secret, and a glyph table
 * living beside the sign-in screen would be the second caller's problem.
 */
export const INPUT_REVEAL_ICONS = {
  reveal: 'eye-outline',
  conceal: 'eye-off-outline',
} as const satisfies Record<string, TileGlyph>;
