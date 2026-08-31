/**
 * A point on an axis, said in words.
 *
 * A profile printed as "kyslosť 7,4" asks the reader to hold a scale in their
 * head, decide where the middle of it is and then decide whether 7,4 is a lot
 * - three judgements to learn one fact about themselves. The band is that
 * judgement made once, by the code that owns the scale.
 *
 * Machine names, translated by whoever prints them, exactly as the conversion
 * report and the insights already work: Slovak declines the adjective
 * differently for every one of the five axes, so a sentence assembled from a
 * shared word and an axis name is one no translator ever saw.
 */
export const TASTE_AXIS_BANDS = {
  veryLow: 'very_low',
  low: 'low',
  balanced: 'balanced',
  high: 'high',
  veryHigh: 'very_high',
} as const;

export type TasteAxisBand = (typeof TASTE_AXIS_BANDS)[keyof typeof TASTE_AXIS_BANDS];

/**
 * Where one band ends and the next begins, on the 0-10 axis scale.
 *
 * The middle band is narrow on purpose. It means "this person genuinely has no
 * strong feeling either way", and a wide neutral band would swallow real
 * preferences - a 4,0 is somebody who leans away from an axis, and rounding
 * that into "vyvážené" throws away the only thing they said.
 */
export const TASTE_AXIS_BAND_LOW = 2.5;
export const TASTE_AXIS_BAND_BALANCED = 4.25;
export const TASTE_AXIS_BAND_HIGH = 5.75;
export const TASTE_AXIS_BAND_VERY_HIGH = 7.5;

export const TASTE_AXIS_BAND_BOUNDS = {
  low: TASTE_AXIS_BAND_LOW,
  balanced: TASTE_AXIS_BAND_BALANCED,
  high: TASTE_AXIS_BAND_HIGH,
  veryHigh: TASTE_AXIS_BAND_VERY_HIGH,
} as const;

/** Turns a stored axis value into the word both sides describe it with. */
export const resolveTasteAxisBand = (value: number): TasteAxisBand => {
  if (value >= TASTE_AXIS_BAND_BOUNDS.veryHigh) {
    return TASTE_AXIS_BANDS.veryHigh;
  }

  if (value >= TASTE_AXIS_BAND_BOUNDS.high) {
    return TASTE_AXIS_BANDS.high;
  }

  if (value >= TASTE_AXIS_BAND_BOUNDS.balanced) {
    return TASTE_AXIS_BANDS.balanced;
  }

  return value >= TASTE_AXIS_BAND_BOUNDS.low ? TASTE_AXIS_BANDS.low : TASTE_AXIS_BANDS.veryLow;
};
