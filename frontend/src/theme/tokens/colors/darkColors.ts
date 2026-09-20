import { BREW_GROUND } from './brewGroundRoles';
import type { ColorPalette } from './colorPalette';
import { ESPRESSO } from './espressoRoles';

/** The dark scheme. Dark brown - never black, never blue-tinted. */
export const DARK_COLORS: ColorPalette = {
  ...ESPRESSO,
  ...BREW_GROUND,
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
  surfaceVariant: '#29211C',
  surfaceDim: '#2E241D',
  surfaceTint: '#4E3220',
  divider: '#2E241D',
  dividerStrong: '#3A2F28',
  outlineFaint: '#4A3E36',
  outlineDashed: '#5A4C42',
  onSurfaceEmpty: '#7A6C60',
  onSurfaceEmptyStrong: '#9A8B7D',
  outline: '#9A8B7D',
  outlineVariant: '#4A3E36',
  /**
   * The A2 design specifies the five roles below on light only. On dark they
   * resolve to the Material roles they correspond to rather than to an
   * invented tint: the redesign re-tinted the light containers for a reason it
   * stated, and there is no equivalent decision on dark to copy.
   */
  freshContainer: '#374524',
  onFreshContainer: '#D6E2C4',
  onFresh: '#B6C79A',
  cautionContainer: '#5A3F1C',
  onCaution: '#DDB27A',
  roastMid: '#A88A6E',
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
