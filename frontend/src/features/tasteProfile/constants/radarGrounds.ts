import type { ColorPalette } from '../../../theme';

/**
 * What the web is drawn on.
 *
 * `espresso` is the profile's own header, where the chart is the screen's
 * headline rather than a figure inside a card. The same shape and the same
 * arithmetic either way - only the palette changes, because a chart that was
 * redrawn for a dark ground would eventually differ from the light one by a
 * ring or a stroke, and the two are meant to be recognisably one picture.
 */
export type RadarGround = 'surface' | 'espresso';

export const DEFAULT_RADAR_GROUND: RadarGround = 'surface';

/** The guide rings and spokes. */
export const RADAR_GUIDE_COLORS = {
  surface: 'outlineVariant',
  espresso: 'espressoLine',
} as const satisfies Record<RadarGround, keyof ColorPalette>;

/** The outermost ring, which is the edge of the scale and may say so. */
export const RADAR_EDGE_COLORS = {
  surface: 'outline',
  espresso: 'espressoLine',
} as const satisfies Record<RadarGround, keyof ColorPalette>;

/** The shape itself, and the vertices it has earned. */
export const RADAR_SHAPE_COLORS = {
  surface: 'primary',
  espresso: 'accentOnEspresso',
} as const satisfies Record<RadarGround, keyof ColorPalette>;

export const RADAR_VERTEX_COLORS = {
  surface: 'primary',
  espresso: 'onEspresso',
} as const satisfies Record<RadarGround, keyof ColorPalette>;

/** A vertex the profile is only guessing at: hollow, filled with the ground. */
export const RADAR_UNKNOWN_FILL_COLORS = {
  surface: 'surface',
  espresso: 'espresso',
} as const satisfies Record<RadarGround, keyof ColorPalette>;

export const RADAR_UNKNOWN_RING_COLORS = {
  surface: 'onSurfaceVariant',
  espresso: 'outlineOnEspresso',
} as const satisfies Record<RadarGround, keyof ColorPalette>;

/** The second shape, when a coffee is held up against a person. */
export const RADAR_OVERLAY_COLORS = {
  surface: 'tertiary',
  espresso: 'onEspressoPositive',
} as const satisfies Record<RadarGround, keyof ColorPalette>;
