import { FONT_FAMILIES } from './fontFamilies';
import type { TypographyStyle } from './typographyStyle';

/**
 * The A2 redesign's own type, beside the Material scale rather than replacing
 * it.
 *
 * Two things separate these from `TYPE_SCALE`. They run tighter - the display
 * sizes carry negative tracking, which Material's do not - and they are named
 * after what they say rather than after a rung on a ladder, because the
 * redesign assigns a size to a job (the answer, the eyebrow over it, the label
 * under a control) rather than to a level of heading.
 *
 * Entries arrive with the screen that needs them. A variant nobody has drawn
 * yet is a guess about a screen nobody has read.
 */
export const REDESIGN_SCALE = {
  /** A screen's own title, and the step being poured in brew mode. */
  displayTitle: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  /** The sentence a screen exists to produce. Larger than anything around it. */
  displayAnswer: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  /** A headline that answers rather than names - an empty state, a coffee. */
  displayCompact: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  /** The redesign's body text, a hair tighter than Material's. */
  bodyText: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  /** The label over the one thing an espresso block holds. */
  eyebrowEspresso: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  /** The sentence directly under a title - an instruction, not body text. */
  bodyLead: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  /** The qualifier under an answer, set to be read rather than glanced at. */
  bodyAnswer: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  /** A second line under something, read after it rather than with it. */
  bodyMuted: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
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
  /** A second line under a row's title, read after it rather than with it. */
  caption: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  /** The smallest thing on a card that is still a sentence. */
  captionSmall: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.3,
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

export type RedesignScaleToken = keyof typeof REDESIGN_SCALE;
