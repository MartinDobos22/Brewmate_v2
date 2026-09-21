/**
 * Fixed component dimensions. These are design decisions, not magic numbers,
 * so they live here rather than inside a StyleSheet.
 */
export const SIZE = {
  buttonHeightSmall: 36,
  buttonHeightMedium: 48,
  inputHeight: 48,
  chipHeight: 32,
  /**
   * A chip that states a fact rather than offering a choice. Smaller than a
   * control, because nothing about it is a touch target.
   */
  attributeChipHeight: 26,
  listItemMinHeight: 56,
  tabBarHeight: 56,
  iconTiny: 13,
  iconSmall: 16,
  iconMedium: 24,
  /**
   * The two steps the redesign needed between `iconSmall` and `iconMedium`: a
   * glyph that leads a row of a table, and one on a control that is pressed
   * rather than read.
   */
  iconRow: 18,
  iconLarge: 20,
  avatarMedium: 40,
  sheetHandleWidth: 32,
  sheetHandleHeight: 4,
  sliderTrackHeight: 6,
  /**
   * Big enough to take hold of with a thumb rather than aim at with a
   * fingertip. It carries a ring of the surface under it, so it needs the
   * extra points to still read as a circle once that is subtracted.
   */
  sliderThumbSize: 30,
  stepperButtonSize: 40,
  /**
   * The floor under a stepper's value, and the reason the control stopped
   * jumping.
   *
   * The value used to be nothing but `flex: 1` between the two buttons, which
   * in a row that sizes itself to its content resolves to no width at all: the
   * number wrapped one character per line, invisible behind its own clipping,
   * and the card grew and shrank by a hundred points every time somebody
   * tapped a plus. A floor wide enough for a four-digit weight and its unit
   * means the two buttons sit in the same place whatever the number does.
   */
  stepperValueMinWidth: 96,
  /**
   * The typed half of that, where the unit sits beside the number rather than
   * inside it. Wide enough for a four-digit water weight and no wider: a field
   * that reserves room it never uses reads as one somebody failed to fill in.
   */
  stepperFieldMinWidth: 64,
  swatchSize: 56,
  /**
   * A version's node on the timeline's rail, and the rail itself.
   *
   * The node carries the version's number rather than a dot, because the one
   * question this screen answers - what did changing that do - is asked about
   * a particular version, and counting dots down a column to find the third
   * one is not how anybody reads.
   */
  timelineNodeSize: 36,
  timelineRailWidth: 2,
  /** A pill saying what was missing on the morning a cup was made. */
  constraintBadgeHeight: 28,
  /** The way into the conversation about one version of a recipe. */
  timelineChatHeight: 46,
  /**
   * One row of a count in the history report: the name it belongs to on the
   * left and the figure on the right, both at fixed widths so the bars between
   * them start and end in one column down the card.
   */
  insightNameWidth: 78,
  insightCountWidth: 26,
  /** A bar in the taste profile chart: readable, but not a block of colour. */
  profileBarHeight: 10,
  /**
   * The taste profile as a five-sided web, on the profile screen.
   *
   * A fixed square rather than a measured one, for the same reason the bars
   * were built from flex weights: the chart is correct on its first frame
   * instead of waiting to be told how wide the phone is, and a radar that
   * reflowed after a layout pass would visibly snap into shape every time the
   * screen opened. Sized to sit comfortably inside a card on the narrowest
   * phone the app supports, labels included.
   */
  radarChartSize: 260,
  /** How much of that square is given to the labels around the web. */
  radarChartLabelInset: 46,
  /** The same web on a home tile, where it is read as a shape and has no labels. */
  radarChartCompactSize: 96,
  /** One axis's glyph in the list under the chart. */
  /** The circle a signed-in person is represented by. */
  profileAvatarSize: 46,
  /** A flavour the profile has an opinion about. */
  flavorChipHeight: 34,
  axisRowGlyph: 19,
  /**
   * How far a divider is inset past that glyph, so the marks form a column of
   * their own and the rows read as a list rather than as five stacked cards.
   */
  axisRowDividerInset: 49,
  /** The box one axis label is centred in, so five of them cannot overlap. */
  radarLabelWidth: 76,
  /** The swatch that says which shape on the web is you and which is the coffee. */
  legendSwatchWidth: 16,
  legendSwatchHeight: 8,
  legendSwatchBorder: 2,
  /** The onboarding progress bar, thinner than a slider track is tall. */
  progressBarHeight: 6,
  /** A bar that measures a quantity rather than counting steps through a flow. */
  measureBarHeight: 8,
  /**
   * A dial: a ring with a figure inside it.
   *
   * Two sizes and no more. The large one carries a bag's freshness on the
   * cupboard, the small one the profile's confidence - and they are the same
   * object at two sizes rather than two objects, because both answer the same
   * shape of question: how far through something are we.
   */
  dialLarge: 76,
  dialLargeStroke: 7,
  dialSmall: 58,
  dialSmallStroke: 6,
  /** The two pills under a bag on the cupboard. */
  bagActionHeight: 46,
  /**
   * The conversation after the cup.
   *
   * The avatar marks who is speaking rather than showing anybody a face, so
   * it is small; the send button is the ordinary field height, so the two sit
   * on one line without either having to be measured against the other.
   */
  chatAvatarSize: 30,
  chatSendSize: 48,
  /** The pill that accepts a proposal, under the table describing it. */
  acceptPillHeight: 50,
  /** The hairline between two figures inside an espresso header's own row. */
  headerRuleHeight: 28,
  /** A round icon button in a screen's title row. */
  headerButtonSize: 44,
  /** The hairline between two figures in a summary row. */
  summaryRuleHeight: 36,
  /**
   * The mark on an empty screen: two dashed rings round the glyph of the thing
   * that is not there yet. The app's own ring motif with nothing in it, which
   * is what an absence looks like without a screen having to say so.
   */
  emptyMarkOuter: 104,
  emptyMarkInner: 70,
  emptyMarkGlyph: 38,
  /** How wide an empty state's sentence may run before it is hard to read. */
  emptyBodyMaxWidth: 300,
  /**
   * The concentric rings behind an espresso header.
   *
   * Pushed off the top left corner and clipped by the block they sit in, which
   * is what makes them read as depth rather than as a diagram. Drawn from the
   * same stroke as every other decoration here - this app ships no artwork.
   */
  headerRingsSize: 300,
  /** The same mark on a card, which is smaller than a header block. */
  cardRingsSize: 250,
  ringStroke: 2,
  /** The circle a glyph sits in inside an espresso header's own row. */
  headerBadgeSize: 38,
  /** A brewer's own glyph, which is the most visual decision on its screen. */
  methodGlyphSize: 27,
  /** A round button inside a calculator row. */
  calculatorButtonSize: 42,
  /** The dot between two facts on a meta line. */
  metaDotSize: 3,
  /**
   * The home screen's own row of actions, inside the espresso block.
   *
   * Bigger than a foot bar's pill because this is the one control on the
   * screen somebody reaches for without reading anything first, and the two
   * round buttons beside it are the same height so the row reads as three
   * ways to start rather than as a button with decorations.
   */
  homeActionSize: 56,
  /** One of the three segments counting the first steps off. */
  startSegmentHeight: 5,
  /** The coloured spine down the left of a bag's row, saying what state it is in. */
  bagSpineWidth: 4,
  bagSpineHeight: 40,
  /** The glyph and the one button on a card reporting that nothing is there yet. */
  emptyRowBadge: 44,
  emptyRowAction: 40,
  /** A pill in an espresso header, and the one in a foot bar. */
  headerPillHeight: 48,
  footBarPillHeight: 52,
  /** The two answers to what happened to a bag in a shop. */
  outcomeButtonHeight: 54,
  /** A questionnaire answer card. Big enough to tap without aiming. */
  optionCardMinHeight: 72,
  /** The disc its glyph sits in, which is what makes a column of them scannable. */
  optionBadgeSize: 40,
  /**
   * The scanner's own block: the badge over its title, and the window that
   * stands in for the photograph nobody has taken yet.
   *
   * The window is sized to be a picture rather than a button - it is the one
   * thing on that card that says what the camera is for, and at button height
   * it would read as a third control between the two real ones.
   */
  scanBadgeSize: 46,
  scanViewfinderHeight: 170,
  scanViewfinderInset: 22,
  /** The camera, and the two quieter ways in beside each other under it. */
  scanCaptureHeight: 52,
  scanAlternativeHeight: 48,
  /** The round way back and the pill out of a step of onboarding. */
  onboardingBackSize: 42,
  onboardingSkipHeight: 38,
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
  brewControlSize: 66,
  brewPrimaryControlSize: 90,
  /** The dot that says which step of the brew is running. */
  brewStepDotSize: 10,
  /**
   * The step bar above the pour, which is thin on purpose.
   *
   * It used to be thick, on the argument that everything on this screen is
   * read from half a metre away. That was right about the countdown and wrong
   * about this: how far through a brew is is glanced at between pours, and a
   * heavy bar across the top competes with the one number the screen exists
   * for. The count beside it is what gets read; the bar is the shape of it.
   */
  brewProgressHeight: 4,
  /**
   * How wide a brew instruction is allowed to run.
   *
   * An instruction is read in one go, so it is held to a width that breaks
   * into two or three even lines rather than one that runs the full width of
   * the phone and has to be tracked back across with wet hands.
   */
  brewInstructionMaxWidth: 300,

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
  brandMarkSize: 72,
  brandMarkInner: 34,
  /** The ring set hanging off the top of a signed-out screen, behind the mark. */
  authRingsSize: 380,
  /** A field on the signed-out screens, which are the only dark forms in the app. */
  authFieldHeight: 52,
  /** The one button those screens most want pressed, and the two beside it. */
  authSubmitHeight: 54,
  authProviderHeight: 52,
} as const;

/** Dimensions expressed as a share of the parent. */
export const RELATIVE_SIZE = {
  chatBubbleMaxWidth: '78%',
  sheetMaxHeight: '86%',
} as const;

export type RelativeSizeToken = keyof typeof RELATIVE_SIZE;

export type SizeToken = keyof typeof SIZE;
