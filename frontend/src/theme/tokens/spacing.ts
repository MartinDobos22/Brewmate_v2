/** 4pt grid. Every gap, padding and margin in the app comes from here. */
export const SPACING = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingToken = keyof typeof SPACING;

/**
 * Named layout distances. A screen edge is always 16, a card pads 16 and cards
 * sit 12 apart - so those three decisions are made once, here, not per screen.
 */
export const LAYOUT_SPACING = {
  screenEdge: SPACING.lg,
  cardPadding: SPACING.lg,
  cardGap: SPACING.md,
  sectionGap: SPACING.xl,
  inlineGap: SPACING.sm,
} as const;

export type LayoutSpacingToken = keyof typeof LAYOUT_SPACING;
