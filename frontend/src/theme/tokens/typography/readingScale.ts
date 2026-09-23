import { FONT_FAMILIES } from './fontFamilies';
import type { TypographyStyle } from './typographyStyle';

/**
 * What a screen says, at the four sizes it says it.
 *
 * A title, the answer the screen exists to produce, the sentence under it and
 * the quieter one after that. These run tighter than a Material ladder - the
 * display sizes carry negative tracking - and they are named after the job
 * rather than after a rung, because the redesign assigns a size to what a
 * piece of text is for.
 */
export const READING_SCALE = {
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
  /** Whose screen this is, beside their own avatar. */
  displayIdentity: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 24,
    lineHeight: 30,
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
} as const satisfies Record<string, TypographyStyle>;
