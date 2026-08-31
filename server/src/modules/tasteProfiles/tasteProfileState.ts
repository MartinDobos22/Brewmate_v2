import {
  TASTE_AXIS_NEUTRAL,
  type FlavorAffinities,
  type MilkUsage,
  type RoastLevel,
  type SourceWeights,
  type TasteAxes,
  type TasteAxisConfidence,
  type TasteAxisName,
} from '@brewmate/shared';

import { NO_EVIDENCE } from './constants/reducerWeights.js';

const NO_CONFIDENCE = 0;
const NO_BREWS = 0;

/**
 * How much has been heard about each axis, in raw evidence rather than as the
 * 0..1 figure the profile carries.
 *
 * Kept unbounded through the fold and only divided down at the end: an account
 * that has said the same thing about acidity twenty times is more certain than
 * one that said it twice, and clamping on the way through would lose that the
 * moment the axis crossed the ceiling.
 */
export type AxisEvidence = Record<TasteAxisName, number>;

/**
 * The profile as the reducer works with it: the stored row without the
 * identity and the timestamp, which belong to the database rather than to the
 * arithmetic.
 */
export interface TasteProfileState extends TasteAxes {
  readonly flavorAffinities: FlavorAffinities;
  readonly roastPreference: RoastLevel | null;
  readonly milkUsage: MilkUsage | null;
  readonly sourceWeights: SourceWeights;
  readonly axisConfidence: TasteAxisConfidence;
  readonly confidenceLevel: number;
  readonly brewCount: number;
}

/**
 * The same number against every axis.
 *
 * Written out rather than built from `TASTE_AXIS_NAMES`, deliberately: a
 * mapped `Object.fromEntries` cannot be typed as a total record without an
 * assertion, and the assertion is what would let a sixth axis be added to the
 * contract and silently arrive here as `undefined`. Spelled out, it is a type
 * error at exactly the moment somebody adds one.
 */
const everyAxis = (value: number): Record<TasteAxisName, number> => ({
  acidity: value,
  sweetness: value,
  body: value,
  bitterness: value,
  intensity: value,
});

/** Nothing heard about any axis yet. */
export const noAxisEvidence = (): AxisEvidence => everyAxis(NO_EVIDENCE);

/**
 * Where every profile starts: the middle of every axis, no preferences and no
 * confidence at all. A fold over zero events must produce exactly this.
 *
 * The middle is a placeholder for silence rather than a belief, which is why
 * `axisConfidence` starts at nothing beside it - the two are read together,
 * and the neutral value means nothing without the zero next to it.
 */
export const neutralProfileState = (): TasteProfileState => ({
  acidity: TASTE_AXIS_NEUTRAL,
  sweetness: TASTE_AXIS_NEUTRAL,
  body: TASTE_AXIS_NEUTRAL,
  bitterness: TASTE_AXIS_NEUTRAL,
  intensity: TASTE_AXIS_NEUTRAL,
  flavorAffinities: {},
  roastPreference: null,
  milkUsage: null,
  sourceWeights: {},
  axisConfidence: everyAxis(NO_CONFIDENCE),
  confidenceLevel: NO_CONFIDENCE,
  brewCount: NO_BREWS,
});
