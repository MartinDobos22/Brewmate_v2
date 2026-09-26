import type { TileGlyph } from '../../../components/ui';

/**
 * The mark the import flow wears at the top of itself.
 *
 * It names what the flow is about rather than what it does. An arrow going
 * into a bracket is the glyph of an action, and in a 46-point circle in the
 * top-left corner - where every application in the world puts a way back -
 * it read as a button somebody was expected to press. The scanner's badge
 * does not have this problem because a barcode is a thing rather than a verb.
 */
export const IMPORT_ICONS = {
  flow: 'text-box-outline',
} as const satisfies Record<string, TileGlyph>;
