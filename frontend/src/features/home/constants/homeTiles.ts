import type { TileGlyph } from '../../../components/ui';

/**
 * The glyph on each tile.
 *
 * Named after what the tile is for rather than after the shape it draws, so
 * swapping an icon is one edit here and never a hunt through the screen.
 */
export const HOME_TILE_ICONS = {
  scan: 'barcode-scan',
  quickBrew: 'lightning-bolt-outline',
  brew: 'coffee-outline',
  taste: 'chart-bar',
  inventory: 'package-variant-closed',
  stats: 'chart-timeline-variant',
  hint: 'lightbulb-on-outline',
} as const satisfies Record<string, TileGlyph>;

/**
 * How many of the cupboard's bags the freshness strip draws.
 *
 * A strip is a glance, not a list: past half a dozen pips nobody counts them,
 * and the caption beside it carries the real number anyway.
 */
export const HOME_FRESHNESS_PIP_MAX = 6;

/** How much of the brewing history the home screen reads. */
export const HOME_STATS = {
  /**
   * Newest first, so one page covers the last week for anybody who is not
   * brewing ten cups a day - and the tile only ever draws the last week.
   */
  brewLogPage: 60,
  weekDays: 7,
  /** After this long without a cup, the hint says so. */
  idleDays: 7,
} as const;
