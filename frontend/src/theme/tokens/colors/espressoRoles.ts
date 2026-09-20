/**
 * The espresso block: a dark surface that sits at the top of a *light* screen
 * and always holds the single most important thing on it.
 *
 * Scheme-independent on purpose. Borrowing `DARK_COLORS` would make the header
 * change colour when somebody switched their phone to dark mode - which is the
 * one thing it must not do, because it is the same object on both. So the
 * values below are spread into each palette unchanged, and a component reading
 * `theme.colors.espresso` gets the same brown whatever the phone is set to.
 */
export interface EspressoRoles {
  /** Header block, primary buttons, selected cards. */
  readonly espresso: string;
  /** Blocks inset within an espresso header. */
  readonly espressoDeep: string;
  /** Secondary buttons sitting on espresso. */
  readonly espressoLift: string;
  /** Rules and the concentric-ring motif on espresso. */
  readonly espressoLine: string;
  /** Text on espresso. */
  readonly onEspresso: string;
  /** Muted text on espresso. Contrast floor - never go lighter. */
  readonly onEspressoVariant: string;
  /** Eyebrows, accent icons and the radar's value stroke on espresso. */
  readonly accentOnEspresso: string;
  /** Icons inside an `espressoLift` button. */
  readonly accentSoft: string;
  /** Confirmations and "ideálne teraz" on espresso. */
  readonly onEspressoPositive: string;
  /**
   * A graphic outline on espresso - the hollow radar vertex that says an axis
   * is unknown. Deliberately below the text floor: it is a 2px ring, not a
   * word, and it has to read as an absence rather than as a reading.
   */
  readonly outlineOnEspresso: string;
  /** Primary-button fill when the ground is espresso. */
  readonly cream: string;
  /** Text on `cream`. */
  readonly onCream: string;
  /**
   * What a cream pill casts onto an espresso ground.
   *
   * Black rather than brown, which is the one place this palette uses it: a
   * shadow tinted with the colour it falls on is a shadow nobody can see, and
   * the lift under that pill is what makes it read as the thing to press.
   */
  readonly espressoShadow: string;
}

export const ESPRESSO: EspressoRoles = {
  espresso: '#3B2415',
  espressoDeep: '#2E1B10',
  espressoLift: '#4A2E1B',
  espressoLine: '#4E3220',
  onEspresso: '#F7EFE6',
  onEspressoVariant: '#C4B6A9',
  accentOnEspresso: '#D9B99C',
  accentSoft: '#E5D5C5',
  onEspressoPositive: '#B6C79A',
  outlineOnEspresso: '#9A8B7D',
  cream: '#F0DCC6',
  onCream: '#3B2415',
  espressoShadow: '#000000',
};
