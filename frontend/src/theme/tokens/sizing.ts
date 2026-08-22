/**
 * Fixed component dimensions. These are design decisions, not magic numbers,
 * so they live here rather than inside a StyleSheet.
 */
export const SIZE = {
  buttonHeightSmall: 36,
  buttonHeightMedium: 48,
  inputHeight: 48,
  chipHeight: 32,
  listItemMinHeight: 56,
  tabBarHeight: 56,
  iconSmall: 16,
  iconMedium: 24,
  avatarMedium: 40,
  sheetHandleWidth: 32,
  sheetHandleHeight: 4,
  sliderTrackHeight: 4,
  sliderThumbSize: 24,
  stepperButtonSize: 40,
  swatchSize: 56,
  /** A bar in the taste profile chart: readable, but not a block of colour. */
  profileBarHeight: 10,
  /** The onboarding progress bar, thinner than a slider track is tall. */
  progressBarHeight: 6,
  /** A questionnaire answer card. Big enough to tap without aiming. */
  optionCardMinHeight: 72,
  /** Height of a boxed preview on the design system screen. */
  previewBoxHeight: 180,
  motionTrackHeight: 8,
  motionTravel: 220,
  /** Minimum touch target, per the platform accessibility guidelines. */
  minTouchTarget: 44,
} as const;

/** Dimensions expressed as a share of the parent. */
export const RELATIVE_SIZE = {
  chatBubbleMaxWidth: '78%',
  sheetMaxHeight: '86%',
} as const;

export type RelativeSizeToken = keyof typeof RELATIVE_SIZE;

export type SizeToken = keyof typeof SIZE;
