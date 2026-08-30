import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';

import { createTileRowStyles } from './TileRow.styles';

export interface TileRowProps {
  readonly children: ReactNode;
}

/**
 * One row of the tile grid.
 *
 * Every tile on the home screen sits in one of these, including the ones that
 * span the whole width: a full-width tile is a row with one child, so there is
 * one way a tile is placed rather than two, and nothing on the screen needs to
 * know how wide the phone is.
 */
export const TileRow = ({ children }: TileRowProps): JSX.Element => {
  const styles = useThemedStyles(createTileRowStyles);

  return <View style={styles.row}>{children}</View>;
};
