import { describe, expect, it } from 'vitest';

import {
  TASTE_AXIS_BANDS,
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  TASTE_AXIS_NEUTRAL,
  resolveTasteAxisBand,
} from '../../src/index.js';

const JUST_UNDER_BALANCED = 4.2;
const JUST_OVER_BALANCED = 5.8;

describe('describing a point on an axis in words', () => {
  it('calls the middle of the scale balanced', () => {
    expect(resolveTasteAxisBand(TASTE_AXIS_NEUTRAL)).toBe(TASTE_AXIS_BANDS.balanced);
  });

  it('reaches both ends of the scale', () => {
    expect(resolveTasteAxisBand(TASTE_AXIS_MIN)).toBe(TASTE_AXIS_BANDS.veryLow);
    expect(resolveTasteAxisBand(TASTE_AXIS_MAX)).toBe(TASTE_AXIS_BANDS.veryHigh);
  });

  /**
   * The middle band is narrow on purpose. A 4,2 is somebody leaning away from
   * an axis, and rounding that into "vyvážené" throws away the only thing they
   * said - which on a five-axis profile is most of what there is to know.
   */
  it('does not round a lean into the middle', () => {
    expect(resolveTasteAxisBand(JUST_UNDER_BALANCED)).toBe(TASTE_AXIS_BANDS.low);
    expect(resolveTasteAxisBand(JUST_OVER_BALANCED)).toBe(TASTE_AXIS_BANDS.high);
  });
});
