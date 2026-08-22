import {
  TASTE_AXIS_NEUTRAL,
  type FlavorAffinities,
  type MilkUsage,
  type RoastLevel,
  type SourceWeights,
  type TasteAxes,
} from '@brewmate/shared';

const NO_CONFIDENCE = 0;
const NO_BREWS = 0;

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
  readonly confidenceLevel: number;
  readonly brewCount: number;
}

/**
 * Where every profile starts: the middle of every axis, no preferences and no
 * confidence at all. A fold over zero events must produce exactly this.
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
  confidenceLevel: NO_CONFIDENCE,
  brewCount: NO_BREWS,
});
