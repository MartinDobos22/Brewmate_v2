/**
 * What the age of the coffee does to a grind, read from the top of the list
 * down: the first band whose `untilDays` the coffee is still inside wins.
 *
 * Both ends of the shelf life pull the same way, and that is not a mistake in
 * the table. A bag under about four days old is still full of carbon dioxide:
 * the gas repels water, the bed is unstable, and the cup comes out thin - an
 * under-extraction, and the answer to an under-extraction is a finer grind. A
 * bag past a month has lost the aromatics that made it worth buying, and a
 * finer grind is the only lever that recovers any of them. The reasons are
 * opposite; the adjustment is the same.
 *
 * In between, nothing. Five days to three weeks is where the method's own
 * window was drawn for, and shifting a grind inside it would be inventing a
 * correction to a coffee that does not need one.
 */
export interface RestGrindBand {
  /** The band covers everything up to and including this age, in days. */
  readonly untilDays: number;
  readonly shift: number;
}

export const REST_GRIND_BANDS: readonly RestGrindBand[] = [
  /** Still degassing. Violent bloom, unstable bed, and a thin cup whatever else is done. */
  { untilDays: 4, shift: -0.2 },
  /** The window everything else in this module assumes. */
  { untilDays: 21, shift: 0 },
  /** Past its peak but not yet flat. */
  { untilDays: 35, shift: -0.1 },
];

/** Beyond the last band: aromatics gone, and a finer grind recovers some of them. */
export const STALE_GRIND_SHIFT = -0.3;
