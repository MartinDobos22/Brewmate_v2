import { FONT_FAMILIES } from './fontFamilies';
import type { TypographyStyle } from './typographyStyle';

/**
 * Material Design 3 type scale, defined once. Display and headline use
 * Schibsted Grotesk; title, body and label use Inter.
 */
export const TYPE_SCALE = {
  displayLarge: {
    fontFamily: FONT_FAMILIES.displaySemiBold,
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: FONT_FAMILIES.displaySemiBold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: FONT_FAMILIES.displayMedium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
} as const satisfies Record<string, TypographyStyle>;

export type TypeScaleToken = keyof typeof TYPE_SCALE;
