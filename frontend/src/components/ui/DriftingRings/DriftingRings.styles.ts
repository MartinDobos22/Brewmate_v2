import { StyleSheet, type ViewStyle } from 'react-native';

import { CIRCLE, RINGS } from '../../../constants';

import type { RingPlacement } from './driftingRings';

/** The rings sit behind everything and take no touches. */
export const DRIFTING_RINGS_STYLES = StyleSheet.create({
  rings: { position: 'absolute' },
});

/**
 * Which corner the set is pushed out of, and how far.
 *
 * Runtime geometry built from the size it is drawn at, so a smaller set is
 * clipped by the same share of itself rather than by a fixed number of points.
 */
const CENTRED = '50%';
const CENTRE = CIRCLE.half;

export const ringPlacement = (size: number, placement: RingPlacement): ViewStyle => {
  const outward = -(size * RINGS.bleed);
  const box = { width: size, height: size };

  if (placement === 'topLeft') {
    return { ...box, top: outward, left: outward };
  }

  /*
   * Centred by its own half-width rather than by a transform, so the rings
   * sit still under a mark that is itself animating - a percentage left with
   * a negative margin resolves once at layout, where a translate would be one
   * more thing for the drift to compose with.
   */
  return placement === 'topCentre'
    ? { ...box, top: -(size * RINGS.topBleed), left: CENTRED, marginLeft: -(size / CENTRE) }
    : { ...box, bottom: outward, right: outward };
};
