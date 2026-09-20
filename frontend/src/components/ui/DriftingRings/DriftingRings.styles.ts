import { StyleSheet, type ViewStyle } from 'react-native';

import { RINGS } from '../../../constants';

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
export const ringPlacement = (size: number, placement: RingPlacement): ViewStyle => {
  const outward = -(size * RINGS.bleed);

  return placement === 'topLeft'
    ? { top: outward, left: outward, width: size, height: size }
    : { bottom: outward, right: outward, width: size, height: size };
};
