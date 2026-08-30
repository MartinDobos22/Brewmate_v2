import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';

import { createTileStyles } from './Tile.styles';
import { TILE_RING_STYLES, type TileTone } from './tileTones';

export interface TileRingsProps {
  readonly tone: TileTone;
}

/**
 * The mark behind a tile's content.
 *
 * Two concentric rings, clipped by the corner they are pushed out of. This app
 * ships no artwork, and it should not: an illustration has a fixed palette and
 * a fixed density, and would be wrong in one of the two colour schemes on the
 * day it was added. A shape drawn from the same radius and border tokens as
 * everything else is right in both, at any size, forever.
 */
export const TileRings = ({ tone }: TileRingsProps): JSX.Element => {
  const styles = useThemedStyles(createTileStyles);
  const ring = styles[TILE_RING_STYLES[tone]];

  return (
    <View style={styles.rings}>
      <View style={[styles.ringOuter, ring]} />
      <View style={[styles.ringInner, ring]} />
    </View>
  );
};
