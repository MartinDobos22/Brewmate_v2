/**
 * Font family names. Each value is the key the font is registered under by
 * `useAppFonts`, so a token and a loaded font can never drift apart.
 *
 * Schibsted Grotesk carries display and headline: geometric and slightly
 * squared off, which matches the shape language. Inter carries body and label.
 * IBM Plex Mono carries every measurable value - grams, seconds, temperature,
 * ratio, grind setting - because proportional digits jump on every tick of a
 * brew timer.
 */
export const FONT_FAMILIES = {
  displayRegular: 'SchibstedGrotesk_400Regular',
  displayMedium: 'SchibstedGrotesk_500Medium',
  displaySemiBold: 'SchibstedGrotesk_600SemiBold',
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  numericRegular: 'IBMPlexMono_400Regular',
  numericMedium: 'IBMPlexMono_500Medium',
  numericSemiBold: 'IBMPlexMono_600SemiBold',
} as const;

export type FontFamilyToken = keyof typeof FONT_FAMILIES;
