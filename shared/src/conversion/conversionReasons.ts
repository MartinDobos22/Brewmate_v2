/**
 * Why a converted number is worth what it is worth.
 *
 * A closed list of machine names rather than free text, and that is the point:
 * the deterministic module decides what happened, the interface says it in
 * Slovak, and a model is never asked to characterise its own accuracy. A
 * sentence written by a model about how confident it is, is not evidence about
 * anything.
 *
 * The list is total over what the conversion can do, so adding a step to the
 * algorithm is a type error at every place that prints a reason rather than an
 * untranslated string on somebody's screen.
 */
export const CONVERSION_REASONS = {
  /** The source stated a particle size outright, so nothing had to be inferred. */
  fromStatedMicrons: 'fromStatedMicrons',
  /** Both collars are in the catalogue with a curve behind them. */
  fromBothCalibrations: 'fromBothCalibrations',
  /** The source grinder is unknown, so the grind came from how it was described. */
  fromGrindWords: 'fromGrindWords',
  /** Neither the grinder nor the words said anything; the method decided it. */
  fromMethodCategory: 'fromMethodCategory',
  /** One of the two curves is an estimate rather than a measurement. */
  calibrationEstimated: 'calibrationEstimated',
  /** One of the two catalogue entries is somebody's own contribution. */
  grinderUnverified: 'grinderUnverified',
  /** The reading fell far enough outside the curve to be an extrapolation. */
  outsideCalibratedRange: 'outsideCalibratedRange',
  /** Their grinder has no curve, so there is no number to give - only words. */
  targetGrinderUncalibrated: 'targetGrinderUncalibrated',
  /** The coffee is pre-ground, or the grinder cannot be moved for this brew. */
  grindNotAdjustable: 'grindNotAdjustable',
  /** Whatever the source said came through untouched. */
  keptFromSource: 'keptFromSource',
  /** The two weights were scaled together, so the ratio is the source's own. */
  ratioPreserved: 'ratioPreserved',
  /** The amounts were brought down to what this brewer holds. */
  scaledToCapacity: 'scaledToCapacity',
  /** The dose was moved into the window this brewer works in. */
  scaledToDoseWindow: 'scaledToDoseWindow',
  /** The source ratio does not belong to this method and was brought inside it. */
  clampedToMethodWindow: 'clampedToMethodWindow',
  /** The pour schedule was scaled with the water it pours. */
  scaledWithWater: 'scaledWithWater',
  /** A different family of brewer: the schedule does not carry over. */
  differentMethodCategory: 'differentMethodCategory',
  /** They cannot set a temperature, so the recipe gives a procedure instead. */
  noTemperatureControl: 'noTemperatureControl',
  /** The source never said, so this is the ordinary figure for the method. */
  notStatedInSource: 'notStatedInSource',
} as const;

export type ConversionReason = (typeof CONVERSION_REASONS)[keyof typeof CONVERSION_REASONS];
