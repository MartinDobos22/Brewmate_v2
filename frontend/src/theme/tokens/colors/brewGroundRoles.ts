/**
 * Brew mode's ground, and only brew mode's.
 *
 * Scheme-independent for the same reason the espresso block is: this screen is
 * dark in both schemes. A kitchen at six in the morning is the case it is
 * drawn for, and a white screen held over a kettle by somebody whose phone
 * happens to be set to light is the case it is drawn against.
 */
export interface BrewGroundRoles {
  /** The screen itself. */
  readonly brewGround: string;
  /** The "Ďalej" pill, the secondary control circles, the ring's guide circles. */
  readonly brewSurface: string;
  /** The scale chip inside the pour ring. */
  readonly brewChip: string;
  /** Step-bar segments and the pour ring's track. */
  readonly brewTrack: string;
  /** The pour arc itself, and what its button's shadow is tinted with. */
  readonly brewArc: string;
}

export const BREW_GROUND: BrewGroundRoles = {
  brewGround: '#16120F',
  brewSurface: '#1E1712',
  brewChip: '#241C15',
  brewTrack: '#2E241D',
  brewArc: '#E7C9AC',
};
