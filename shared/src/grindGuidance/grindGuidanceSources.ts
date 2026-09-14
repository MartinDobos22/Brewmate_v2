/**
 * What the starting point was read off.
 *
 * Worth naming rather than leaving implicit, because the two are worth
 * different amounts and the difference is visible to the person following the
 * advice. A published range is somebody's stated recommendation for this exact
 * model; a method window is Brewmate's own figure for the whole family of
 * brewer, read through this grinder's curve. Both are starting points, but
 * only one of them is about this grinder.
 */
export const GRIND_GUIDANCE_SOURCES = {
  publishedRange: 'publishedRange',
  methodWindow: 'methodWindow',
} as const;

export type GrindGuidanceSource =
  (typeof GRIND_GUIDANCE_SOURCES)[keyof typeof GRIND_GUIDANCE_SOURCES];
