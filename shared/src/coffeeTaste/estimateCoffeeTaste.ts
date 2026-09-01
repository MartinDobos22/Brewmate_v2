import {
  foldAxisObservations,
  type AxisObservation,
} from '../tasteProfiles/foldAxisObservations.js';
import type { TasteAxisName } from '../tasteProfiles/tasteAxesSchema.js';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  TASTE_AXIS_NEUTRAL,
} from '../tasteProfiles/tasteProfileFieldLimits.js';

import {
  COFFEE_ESTIMATE_SOURCES,
  COFFEE_SIGNAL_SOURCES,
  type CoffeeEstimateSource,
  type CoffeeSignalSource,
} from './coffeeSignalSources.js';
import type { CoffeeTasteEstimate } from './coffeeTasteEstimateSchema.js';
import type { CoffeeTasteSignal } from './coffeeTasteSignal.js';
import {
  FULL_COFFEE_AXIS_EVIDENCE,
  MAX_COFFEE_SIGNAL_DISAGREEMENT,
} from './constants/signalWeights.js';

/** One axis, once every signal that mentioned it has been weighed together. */
interface AxisEstimate {
  readonly value: number;
  readonly confidence: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const observationsFor = (
  signals: readonly CoffeeTasteSignal[],
  axis: TasteAxisName,
): readonly AxisObservation[] =>
  signals.flatMap((signal: CoffeeTasteSignal): readonly AxisObservation[] => {
    const value = signal.axes[axis];

    return value === undefined ? [] : [{ value, weight: signal.weight }];
  });

/**
 * One axis of the estimate.
 *
 * Neutral is a placeholder for silence here exactly as it is in a taste
 * profile. An axis no signal spoke about is left in the middle carrying no
 * confidence at all, so a bag that printed nothing but a name comes out as
 * five middles that openly admit to being five middles - rather than as a
 * confident claim that this coffee is unremarkable in every direction.
 *
 * Signals that disagree lower the confidence instead of quietly averaging into
 * it. A dark-roasted Ethiopian natural is the case worth naming: the origin
 * and the process argue for a bright fruity cup, the roast argues for a heavy
 * bitter one, both are right, and what the label honestly supports is "this
 * could go either way" rather than the midpoint stated firmly.
 */
const estimateAxis = (signals: readonly CoffeeTasteSignal[], axis: TasteAxisName): AxisEstimate => {
  const folded = foldAxisObservations(
    observationsFor(signals, axis),
    MAX_COFFEE_SIGNAL_DISAGREEMENT,
  );

  if (folded === null) {
    return { value: TASTE_AXIS_NEUTRAL, confidence: CONFIDENCE_MIN };
  }

  return {
    value: folded.value,
    confidence: clamp(
      folded.agreement * (folded.coverage / FULL_COFFEE_AXIS_EVIDENCE),
      CONFIDENCE_MIN,
      CONFIDENCE_MAX,
    ),
  };
};

/** Every distinct kind of evidence that contributed, so the app can say so. */
const usedSources = (signals: readonly CoffeeTasteSignal[]): CoffeeSignalSource[] => [
  ...new Set(signals.map((signal: CoffeeTasteSignal): CoffeeSignalSource => signal.source)),
];

/**
 * Derived rather than declared, so it cannot disagree with the evidence.
 *
 * A caller that asked a model and got nothing usable would otherwise be free
 * to label the result as the model's, and the one thing this field exists to
 * say is whether anything beyond the printed label was read.
 */
const estimateSource = (signals: readonly CoffeeTasteSignal[]): CoffeeEstimateSource =>
  signals.some(
    (signal: CoffeeTasteSignal): boolean => signal.source === COFFEE_SIGNAL_SOURCES.modelReading,
  )
    ? COFFEE_ESTIMATE_SOURCES.model
    : COFFEE_ESTIMATE_SOURCES.label;

/**
 * What a coffee probably tastes like, on the axes its drinker is described on.
 *
 * The same arithmetic as the taste profile, pointed at a bag instead of at a
 * person, and that is the design rather than a convenience. A recommendation
 * is only as good as the comparison behind it, and two things can only be
 * compared if they were measured the same way - so a coffee is folded from
 * weighted observations exactly as a questionnaire is, disagrees with itself
 * in exactly the same way, and reports its uncertainty in the same units.
 *
 * Takes signals rather than a label so that the model's reading is just
 * another signal. Nothing here knows or cares whether a model was involved:
 * the tables produce observations, the model produces observations, and the
 * fold weighs them against each other. Which means an estimate can never come
 * back as something a model asserted over the evidence - the worst failure
 * available to a feature like this.
 */
export const estimateCoffeeTaste = (signals: readonly CoffeeTasteSignal[]): CoffeeTasteEstimate => {
  const acidity = estimateAxis(signals, 'acidity');
  const sweetness = estimateAxis(signals, 'sweetness');
  const body = estimateAxis(signals, 'body');
  const bitterness = estimateAxis(signals, 'bitterness');
  const intensity = estimateAxis(signals, 'intensity');

  return {
    axes: {
      acidity: acidity.value,
      sweetness: sweetness.value,
      body: body.value,
      bitterness: bitterness.value,
      intensity: intensity.value,
    },
    axisConfidence: {
      acidity: acidity.confidence,
      sweetness: sweetness.confidence,
      body: body.confidence,
      bitterness: bitterness.confidence,
      intensity: intensity.confidence,
    },
    signals: usedSources(signals),
    source: estimateSource(signals),
  };
};
