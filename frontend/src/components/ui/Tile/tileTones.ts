import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import type { ColorPalette } from '../../../theme';

/**
 * The glyph a tile is marked with.
 *
 * Taken from the icon set's own union rather than declared as a string, so a
 * misspelled glyph is a compile error instead of a blank square on the home
 * screen.
 */
export type TileGlyph = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * How loudly a tile speaks.
 *
 * Three tones rather than one per feature: a screen where every tile is
 * coloured is a screen with no hierarchy at all. `primary` is for the one
 * thing this screen most wants pressed, `accent` for the second, and
 * `neutral` for everything that reports rather than invites.
 */
export type TileTone = 'primary' | 'accent' | 'neutral';

export const DEFAULT_TILE_TONE: TileTone = 'neutral';

/**
 * Which colour each tone's glyph carries.
 *
 * A colour role rather than a value: the tile is painted by the stylesheet
 * from the same theme, so the two cannot land on different palettes.
 */
export const TILE_ICON_COLORS: Record<TileTone, keyof ColorPalette> = {
  primary: 'primary',
  accent: 'secondary',
  neutral: 'onSurfaceVariant',
};

/** Which badge fill each tone uses, named as a key of the tile stylesheet. */
export const TILE_BADGE_STYLES = {
  primary: 'badgePrimary',
  accent: 'badgeAccent',
  neutral: 'badgeNeutral',
} as const satisfies Record<TileTone, string>;

/** Which ring colour each tone uses, named as a key of the tile stylesheet. */
export const TILE_RING_STYLES = {
  primary: 'ringPrimary',
  accent: 'ringAccent',
  neutral: 'ringNeutral',
} as const satisfies Record<TileTone, string>;
