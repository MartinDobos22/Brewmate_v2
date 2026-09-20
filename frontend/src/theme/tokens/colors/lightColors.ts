import { BREW_GROUND } from './brewGroundRoles';
import type { ColorPalette } from './colorPalette';
import { ESPRESSO } from './espressoRoles';

/**
 * The light scheme. Saturated colour is reserved for the primary action and
 * for a single status indicator (`tertiary`); everything else is a warm
 * neutral scale.
 */
export const LIGHT_COLORS: ColorPalette = {
  ...ESPRESSO,
  ...BREW_GROUND,
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
  /** One step warmer than it was, so an espresso block sits on a ground it belongs to. */
  background: '#F2EDE6',
  onBackground: '#241C15',
  surface: '#FFFDFA',
  onSurface: '#241C15',
  onSurfaceVariant: '#5C5148',
  surfaceContainer: '#EDE6DD',
  surfaceContainerHigh: '#E5DCD1',
  surfaceVariant: '#F4EDE5',
  surfaceDim: '#EFE7DE',
  surfaceTint: '#EFDFCC',
  divider: '#F4EDE5',
  dividerStrong: '#E8E0D6',
  outlineFaint: '#E4DCD2',
  outlineDashed: '#DCD1C4',
  onSurfaceEmpty: '#C9BCAE',
  onSurfaceEmptyStrong: '#B3A597',
  outline: '#8A7D70',
  outlineVariant: '#D6CCC0',
  freshContainer: '#DFE6D2',
  onFreshContainer: '#3D4432',
  onFresh: '#3F5427',
  cautionContainer: '#F7EDE0',
  onCaution: '#8A5B1E',
  roastMid: '#8C5A34',
  error: '#8C3A2B',
  onError: '#FFFFFF',
  errorContainer: '#F2DCD6',
  onErrorContainer: '#3A130C',
  scrim: '#241C15',
  shadow: '#241C15',
  inverseSurface: '#332822',
  onInverseSurface: '#F5F1EC',
  disabled: '#E5DCD1',
  /**
   * The muted floor rather than a lighter grey. What was here failed 4.5:1
   * against every ground it is drawn on, which meant the one state that has to
   * say "this is not available yet" was the hardest thing on the screen to
   * read.
   */
  onDisabled: '#5C5148',
};
