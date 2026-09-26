import type { BrewGroundRoles } from './brewGroundRoles';
import type { EspressoRoles } from './espressoRoles';

/**
 * Colour roles, named after Material Design 3, plus the two scheme-independent
 * blocks the A2 redesign introduced. Spreading those in rather than exposing
 * them separately keeps the one access path every component already uses:
 * `theme.colors.<role>`.
 */
export interface ColorPalette extends EspressoRoles, BrewGroundRoles {
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
  /** Secondary buttons, chips and inset blocks on a light ground. */
  readonly surfaceVariant: string;
  /** Progress tracks and the radar's guide rings - a surface read as a scale. */
  readonly surfaceDim: string;
  /** The pill behind the active tab-bar item. */
  readonly surfaceTint: string;
  /** A rule inside a card. */
  readonly divider: string;
  /** The tab bar's and a foot bar's own border, which separates two surfaces. */
  readonly dividerStrong: string;
  /** The rules between columns of figures. */
  readonly outlineFaint: string;
  /** Dashed frames - a camera target, an empty-state ring. */
  readonly outlineDashed: string;
  /**
   * The glyph in an empty state. Never a text colour: an empty screen states
   * what it does not know in words at the ordinary muted tone, and draws the
   * absence at these two.
   */
  readonly onSurfaceEmpty: string;
  /** The same, one step heavier, where the glyph carries the state on its own. */
  readonly onSurfaceEmptyStrong: string;
  readonly outline: string;
  readonly outlineVariant: string;
  /** A hint card's ground. */
  readonly freshContainer: string;
  /** Body text on `freshContainer`. */
  readonly onFreshContainer: string;
  /** "Ideálne teraz", and every confirmation written on a light ground. */
  readonly onFresh: string;
  /** A constraint note's ground - something is missing, nothing is wrong. */
  readonly cautionContainer: string;
  /** An ageing bag, and the text of a constraint note. */
  readonly onCaution: string;
  /** A bar that is not the leader, where the leader carries `primary`. */
  readonly roastMid: string;
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
