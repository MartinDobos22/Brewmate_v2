/** 4pt grid. Every gap, padding and margin in the app comes from here. */
export const SPACING = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  /**
   * The redesign's screen edge, and the gap between its sections. The step
   * between `lg` and `xl` the scale never had: sixteen round a screen whose
   * cards carry no borders left them reading as if they had been pushed
   * against the glass, and twenty-four cost a column of the numbers.
   */
  lgPlus: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingToken = keyof typeof SPACING;

/**
 * Named layout distances, made once here rather than per screen.
 *
 * The edge and the gap between cards are the redesign's, and they moved
 * together for one reason: cards carry no borders any more, so what separates
 * a card from the glass and a card from the next card is space alone.
 * Sixteen round a bordered card read as a margin; round a borderless one it
 * read as a card pushed against the edge of the phone. Twenty and sixteen are
 * what the redesign specifies, and they are the two numbers every screen in
 * the app inherits without naming either.
 */
export const LAYOUT_SPACING = {
  screenEdge: SPACING.lgPlus,
  cardPadding: SPACING.lg,
  cardGap: SPACING.lg,
  sectionGap: SPACING.xl,
  inlineGap: SPACING.sm,
} as const;

export type LayoutSpacingToken = keyof typeof LAYOUT_SPACING;
