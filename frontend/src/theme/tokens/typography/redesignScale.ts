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
  /** The word under an icon inside a circular control. */
  controlLabel: {
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
