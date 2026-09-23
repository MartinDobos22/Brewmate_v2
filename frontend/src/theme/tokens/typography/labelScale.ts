import { FONT_FAMILIES } from './fontFamilies';
import type { TypographyStyle } from './typographyStyle';

/**
 * What a screen names: a group, a card, a row, a control, a figure.
 *
 * None of these is a sentence. They sit over something or inside it and say
 * what it is, which is why they are the small end of the scale and why two of
 * them are upper-cased where nothing else in the app is.
 *
 * Entries arrive with the screen that needs them. A variant nobody has drawn
 * yet is a guess about a screen nobody has read.
 */
export const LABEL_SCALE = {
  /** The label over the one thing an espresso block holds. */
  eyebrowEspresso: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  /**
   * The label on a control sized to be hit without aiming. Larger than any
   * other button in the app, because the hand pressing it is wet.
   */
  actionLarge: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 21,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  /** The label over a group of cards. */
  sectionHeading: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  /** What a card is about - a coffee's name, a version's number. */
  itemTitle: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  /** What a small card or an inset row is about. */
  cardTitle: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.05,
  },
  /** The title of a row that leads somewhere. */
  rowTitle: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  /** The label on a pill. */
  actionLabel: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  /** A state said in words beside the colour and the glyph saying it. */
  statusLabel: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  /** The unit beside a calculator's figure, on its baseline. */
  unitLarge: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  /** A fact printed on an attribute chip. */
  chipLabel: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  /** The label over a figure, and the only upper-cased text on a light ground. */
  eyebrow: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  /**
   * The word under a tab-bar glyph.
   *
   * Not the eyebrow, which is the same size and upper-cased: four upper-cased
   * words along the bottom edge of every screen would shout the app's own
   * furniture at the reader all day.
   */
  tabLabel: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  /**
   * The word under an icon inside a circular control, and the unit under a
   * figure inside a dial. The smallest type in the app: it names something
   * already drawn rather than saying anything on its own.
   */
  microLabel: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.3,
  },
  /** The unit beside a measured value, where the value is set in mono. */
  unitLabel: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.4,
  },
} as const satisfies Record<string, TypographyStyle>;
