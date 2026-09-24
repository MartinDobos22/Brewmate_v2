import type { TileGlyph } from '../../../components/ui';

/**
 * The mark the import flow wears at the top of itself.
 *
 * The same glyph the profile's own row into this flow carries, so pressing
 * one and arriving at the other is recognisably the same errand - which is
 * the rule the scanner's badge already follows.
 */
export const IMPORT_ICONS = {
  flow: 'import',
} as const satisfies Record<string, TileGlyph>;
