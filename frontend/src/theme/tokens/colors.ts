/**
 * The only file in the app allowed to contain colour literals.
 * ESLint rejects a hex colour anywhere outside src/theme/tokens.
 *
 * The palette is deliberately quiet: saturated colour is reserved for the
 * primary action and for a single status indicator (`tertiary`). Everything
 * else carries a neutral warm scale. Dark mode is dark brown - never black,
 * never blue-tinted.
 */

/** Colour roles, named after Material Design 3. */
export interface ColorPalette {
  readonly primary: string;
  readonly onPrimary: string;
  readonly primaryContainer: string;
  readonly onPrimaryContainer: string;
  readonly secondary: string;
  readonly onSecondary: string;
  readonly secondaryContainer: string;
  readonly onSecondaryContainer: string;
  /** Honey. Resting-coffee state and warnings only - nothing else. */
  readonly tertiary: string;
  readonly onTertiary: string;
  readonly tertiaryContainer: string;
  readonly onTertiaryContainer: string;
  readonly background: string;
  readonly onBackground: string;
  readonly surface: string;
  readonly onSurface: string;
  readonly onSurfaceVariant: string;
  readonly surfaceContainer: string;
  readonly surfaceContainerHigh: string;
  readonly outline: string;
  readonly outlineVariant: string;
  readonly error: string;
  readonly onError: string;
  readonly errorContainer: string;
  readonly onErrorContainer: string;
  readonly scrim: string;
  readonly shadow: string;
  readonly inverseSurface: string;
  readonly onInverseSurface: string;
  readonly disabled: string;
  readonly onDisabled: string;
}

export const LIGHT_COLORS: ColorPalette = {
  primary: '#6B4226',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E8D9CB',
  onPrimaryContainer: '#2A1A0F',
  secondary: '#4A6130',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DCE3CE',
  onSecondaryContainer: '#1B2412',
  tertiary: '#A8722C',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F0DFC6',
  onTertiaryContainer: '#3A2710',
  background: '#F5F1EC',
  onBackground: '#241C15',
  surface: '#FFFDFA',
  onSurface: '#241C15',
  onSurfaceVariant: '#5C5148',
  surfaceContainer: '#EDE6DD',
  surfaceContainerHigh: '#E5DCD1',
  outline: '#8A7D70',
  outlineVariant: '#D6CCC0',
  error: '#8C3A2B',
  onError: '#FFFFFF',
  errorContainer: '#F2DCD6',
  onErrorContainer: '#3A130C',
  scrim: '#241C15',
  shadow: '#241C15',
  inverseSurface: '#332822',
  onInverseSurface: '#F5F1EC',
  disabled: '#E5DCD1',
  onDisabled: '#9A8B7D',
};

export const DARK_COLORS: ColorPalette = {
  primary: '#D9B99C',
  onPrimary: '#3B2415',
  primaryContainer: '#4E3220',
  onPrimaryContainer: '#F0DECC',
  secondary: '#B6C79A',
  onSecondary: '#253216',
  secondaryContainer: '#374524',
  onSecondaryContainer: '#D6E2C4',
  tertiary: '#DDB27A',
  onTertiary: '#3F2A10',
  tertiaryContainer: '#5A3F1C',
  onTertiaryContainer: '#F2DCBE',
  background: '#16120F',
  onBackground: '#EDE4DA',
  surface: '#1E1815',
  onSurface: '#EDE4DA',
  onSurfaceVariant: '#C4B6A9',
  surfaceContainer: '#29211C',
  surfaceContainerHigh: '#342A24',
  outline: '#9A8B7D',
  outlineVariant: '#4A3E36',
  error: '#E0A093',
  onError: '#4A1810',
  errorContainer: '#66281C',
  onErrorContainer: '#F7DED7',
  scrim: '#0C0A08',
  shadow: '#0C0A08',
  inverseSurface: '#EDE4DA',
  onInverseSurface: '#1E1815',
  disabled: '#342A24',
  onDisabled: '#7A6C60',
};
