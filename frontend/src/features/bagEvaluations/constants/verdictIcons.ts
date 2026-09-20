import type { TileGlyph } from '../../../components/ui';
import type { ColorPalette } from '../../../theme';

import { BAG_SCAN_FIELDS, type BagScanField } from './bagScan';

/**
 * The mark each line of the argument carries.
 *
 * A reason is marked with the fact it was argued from rather than with a tick.
 * Half of them argue against the coffee - "praženie je iné, než aké ti zvykne
 * sadnúť" is a reason, and as welcome as one for it - and a green check beside
 * that sentence would turn the argument into an endorsement of itself. The
 * glyph classifies; it never grades.
 */
export const VERDICT_REASON_ICONS = {
  [BAG_SCAN_FIELDS.roastLevel]: 'fire',
  [BAG_SCAN_FIELDS.tastingNotes]: 'fruit-citrus',
  [BAG_SCAN_FIELDS.roastDate]: 'clock-outline',
  [BAG_SCAN_FIELDS.tasteProfile]: 'chart-scatter-plot',
} as const satisfies Record<BagScanField, TileGlyph>;

/**
 * What the app could not see, marked by the thing that was missing.
 *
 * Same fields, different glyphs: a roast date the verdict argued from and a
 * roast date it never had are two different statements, and drawing them with
 * one mark would make the second read as the first.
 */
export const VERDICT_GAP_ICONS = {
  [BAG_SCAN_FIELDS.roastLevel]: 'fire-off',
  [BAG_SCAN_FIELDS.tastingNotes]: 'comment-off-outline',
  [BAG_SCAN_FIELDS.roastDate]: 'calendar-remove-outline',
  [BAG_SCAN_FIELDS.tasteProfile]: 'chart-scatter-plot',
} as const satisfies Record<BagScanField, TileGlyph>;

/**
 * Which colour a reason's mark reads in.
 *
 * Freshness is the one that is not about anybody's taste - a bag roasted
 * yesterday is still degassing whoever is drinking it - so it is the one drawn
 * in the caution colour. The rest are drawn in the fresh one because they are
 * comparisons that were possible to make, not because they came out well.
 */
export const VERDICT_REASON_COLORS = {
  [BAG_SCAN_FIELDS.roastLevel]: 'secondary',
  [BAG_SCAN_FIELDS.tastingNotes]: 'secondary',
  [BAG_SCAN_FIELDS.roastDate]: 'tertiary',
  [BAG_SCAN_FIELDS.tasteProfile]: 'secondary',
} as const satisfies Record<BagScanField, keyof ColorPalette>;

/** The two headings the argument is split under. */
export const VERDICT_GROUP_ICONS = {
  reasons: 'scale-balance',
  gaps: 'eye-off-outline',
} as const satisfies Record<string, TileGlyph>;

/** The mark on a line whose own argument nothing recorded a kind for. */
export const VERDICT_UNTYPED_ICON = 'circle-medium' satisfies TileGlyph;

/**
 * The marks on the lines under the verdict, which are about the advice rather
 * than part of it: when it was given, how much the app knew, and who wrote it.
 */
export const PROVENANCE_ICONS = {
  history: 'history',
  confidence: 'account-question-outline',
  offline: 'cellphone-cog',
} as const satisfies Record<string, TileGlyph>;
