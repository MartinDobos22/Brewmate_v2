import { describe, expect, it } from 'vitest';

import {
  DIAL_IN_CHANGES,
  DIAL_IN_DIRECTIONS,
  SHOT_TRENDS,
  WATER_TYPES,
  resolveShotTimeline,
  type BrewLog,
  type PartialBrewParams,
  type ShotSource,
} from '../../src/index.js';

const DOSE = 18;
const YIELD = 36;
const SLOW_SECONDS = 40;
const CLOSER_SECONDS = 34;
const ON_TARGET_SECONDS = 28;
const FAST_SECONDS = 18;
const COARSE_SETTING = 20;
const FINER_SETTING = 18;
const HEAVIER_DOSE = 19;
const FULL_WEIGHT = 1;
const FIRST = 0;
const SECOND = 1;
const THIRD = 2;
const SHOT_ONE = 1;
const SHOT_THREE = 3;
const EXPECTED_RATIO = 2;

const logId = (index: number): string => `00000000-0000-4000-8000-00000000000${String(index)}`;

const shot = (index: number, actualParams: PartialBrewParams): ShotSource => ({
  log: {
    id: logId(index),
    userId: logId(FIRST),
    recipeId: logId(FIRST),
    bagId: null,
    equipmentSetId: null,
    constraints: {},
    actualParams,
    waterType: WATER_TYPES.filtered,
    durationSeconds: null,
    profileLearningWeight: FULL_WEIGHT,
    createdAt: '2026-01-01T00:00:00.000Z',
  } satisfies BrewLog,
  grindSetting: actualParams.grindSetting ?? null,
});

describe('the run of shots behind a dial-in', () => {
  it('numbers the shots from one, oldest first', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: SLOW_SECONDS }),
    ]);

    expect(timeline[FIRST]?.shotNumber).toBe(SHOT_ONE);
    expect(timeline[FIRST]?.ratio).toBe(EXPECTED_RATIO);
  });

  /** The first shot has nothing to be different from, and is not a change. */
  it('reports no change for the first shot', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: SLOW_SECONDS }),
    ]);

    expect(timeline[FIRST]?.change).toBe(DIAL_IN_CHANGES.none);
    expect(timeline[FIRST]?.trend).toBe(SHOT_TRENDS.steady);
  });

  it('names the grind as what moved, and which way it went', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, {
        doseGrams: DOSE,
        waterGrams: YIELD,
        totalTimeSeconds: FAST_SECONDS,
        grindSetting: COARSE_SETTING,
      }),
      shot(THIRD, {
        doseGrams: DOSE,
        waterGrams: YIELD,
        totalTimeSeconds: ON_TARGET_SECONDS,
        grindSetting: FINER_SETTING,
      }),
    ]);

    expect(timeline[SECOND]?.change).toBe(DIAL_IN_CHANGES.grind);
    expect(timeline[SECOND]?.direction).toBe(DIAL_IN_DIRECTIONS.finer);
  });

  it('names the dose when that is what moved instead', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, {
        doseGrams: DOSE,
        waterGrams: YIELD,
        totalTimeSeconds: FAST_SECONDS,
        grindSetting: COARSE_SETTING,
      }),
      shot(THIRD, {
        doseGrams: HEAVIER_DOSE,
        waterGrams: YIELD,
        totalTimeSeconds: ON_TARGET_SECONDS,
        grindSetting: COARSE_SETTING,
      }),
    ]);

    expect(timeline[SECOND]?.change).toBe(DIAL_IN_CHANGES.dose);
    expect(timeline[SECOND]?.direction).toBe(DIAL_IN_DIRECTIONS.more);
  });

  /**
   * The trend is what makes the timeline worth drawing: three shots that all
   * ran long say nothing on their own, and "each one is closer than the last"
   * says the change is working.
   */
  it('says whether a shot came closer to the window than the one before it', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: SLOW_SECONDS }),
      shot(THIRD, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: CLOSER_SECONDS }),
      shot(SHOT_THREE, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: ON_TARGET_SECONDS }),
    ]);

    expect(timeline[SECOND]?.trend).toBe(SHOT_TRENDS.closer);
    expect(timeline[THIRD]?.trend).toBe(SHOT_TRENDS.closer);
  });

  it('says when a shot went the wrong way', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: CLOSER_SECONDS }),
      shot(THIRD, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: SLOW_SECONDS }),
    ]);

    expect(timeline[SECOND]?.trend).toBe(SHOT_TRENDS.further);
  });

  /** Anywhere inside the window is on target, so two good shots are not a trend. */
  it('treats two shots inside the window as steady rather than as progress', () => {
    const timeline = resolveShotTimeline([
      shot(SHOT_ONE, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: ON_TARGET_SECONDS }),
      shot(THIRD, { doseGrams: DOSE, waterGrams: YIELD, totalTimeSeconds: ON_TARGET_SECONDS }),
    ]);

    expect(timeline[SECOND]?.trend).toBe(SHOT_TRENDS.steady);
  });
});
