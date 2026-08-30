import type { TileGlyph } from '../../../components/ui';

/**
 * The glyphs on the profile screen's navigational tiles.
 *
 * Named after where the tile leads rather than after the shape it draws, so
 * swapping an icon is one edit here rather than a hunt through the screen.
 */
export const PROFILE_TILE_ICONS = {
  insights: 'chart-box-outline',
  costs: 'cash-multiple',
  designSystem: 'palette-outline',
} as const satisfies Record<string, TileGlyph>;
