import type { TileGlyph } from '../../../components/ui';

/**
 * The glyph on each thing the home screen offers.
 *
 * Named after what it is for rather than after the shape it draws, so swapping
 * an icon is one edit here and never a hunt through the screen.
 */
export const HOME_TILE_ICONS = {
  scan: 'barcode-scan',
  quickBrew: 'lightning-bolt-outline',
  brew: 'coffee-outline',
  taste: 'chart-bar',
  inventory: 'package-variant-closed',
  stats: 'chart-timeline-variant',
  hint: 'lightbulb-on-outline',
  start: 'clipboard-text-outline',
  go: 'arrow-right',
  add: 'plus',
} as const satisfies Record<string, TileGlyph>;

/**
 * What the screen reads to work out what to offer brewing.
 *
 * One recipe, because the API returns pinned ones first and the screen prints
 * exactly one set of numbers. Asking for a page of them so as to pick the
 * first would be reading a list to answer a question about its head.
 */
export const HOME_SUGGESTION = { recipePage: 1 } as const;

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

/**
 * How much of the shelf the home screen prints.
 *
 * Three, because this is a summary with a tab of its own one tap below it -
 * a home screen that listed a whole cupboard would be the cupboard with a
 * greeting on top. Three is also what fits above the fold on the phone this
 * was drawn for, and the ordering means they are the three worth seeing.
 */
export const HOME_CUPBOARD = { rows: 3 } as const;
