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
  secondary: '#9DC4AE',
  onSecondary: '#253216',
  secondaryContainer: '#2B3A33',
  onSecondaryContainer: '#C6DCD0',
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
   *
   * The green is a pine rather than an olive, and that is the whole of the
   * decision. Warm and yellow-heavy, it sat a few degrees of hue from the
   * brown it is printed on and read as that brown gone wrong - muddy rather
   * than green. Moved the other way, away from the ground instead of towards
   * it, it stops competing with the palette and starts reading as what it
   * means: ready, ideal, confirmed.
   *
   * Only the dark scheme moves. The light one's `#DFE6D2` is the handoff's
   * own hint card, measured against a warm white rather than against a warm
   * brown, and it has never had this problem.
   */
  freshContainer: '#2B3A33',
  onFreshContainer: '#C6DCD0',
  onFresh: '#9DC4AE',
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
