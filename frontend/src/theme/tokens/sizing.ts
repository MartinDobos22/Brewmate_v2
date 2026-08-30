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
  /**
   * Brew mode is operated with one wet finger while looking at a phone
   * propped up half a metre away, so nothing there is sized by the ordinary
   * rules. A control is a third bigger than the smallest a guideline allows,
   * and the countdown is set at a size that carries across a kitchen.
   */
  brewControlSize: 64,
  brewPrimaryControlSize: 88,
  /** The dot that says which step of the brew is running. */
  brewStepDotSize: 10,
  brewProgressHeight: 12,

  /**
   * The home screen is a grid of tiles rather than a column of cards, so a
   * tile has a floor: two of them side by side have to stay square-ish on a
   * small phone, and a tile that collapsed onto its title would read as a list
   * row with a picture on it.
   */
  tileMinHeight: 132,
  /** The badge a tile's glyph sits in, top left of every tile. */
  tileBadgeSize: 36,
  /**
   * The two rings bleeding out of a tile's top right corner.
   *
   * Drawn rather than illustrated: this app ships no artwork, and a geometric
   * mark built from the same radius scale as everything else stays correct in
   * both schemes and at any density. The offset is negative on purpose - the
   * rings are clipped by the tile, which is what makes them read as a
   * decoration rather than as a diagram.
   */
  tileRingOuter: 148,
  tileRingInner: 96,
  tileRingOffset: -46,
  /** The miniature brewing chart on the home screen. */
  tileChartHeight: 52,
  /**
   * One axis of the miniature taste profile. Thinner than the labelled chart's
   * own bar, because five of these are read as a shape rather than as five
   * measurements.
   */
  tileTrackHeight: 6,
  /** The smallest a bar in a miniature chart may be drawn at. */
  tileBarMinHeight: 3,
  /** One bag in the cupboard tile's freshness strip. */
  tilePipSize: 10,

  /**
   * The mark on the signed-out screens.
   *
   * Drawn from the same rings the tiles are decorated with rather than shipped
   * as artwork: this is the first thing anybody sees, in whichever colour
   * scheme their phone is set to, and a raster icon would be right in one of
   * the two and wrong in the other from the day it was added.
   */
  brandMarkSize: 64,
  brandMarkInner: 34,
} as const;

/** Dimensions expressed as a share of the parent. */
export const RELATIVE_SIZE = {
  chatBubbleMaxWidth: '78%',
  sheetMaxHeight: '86%',
} as const;

export type RelativeSizeToken = keyof typeof RELATIVE_SIZE;

export type SizeToken = keyof typeof SIZE;
