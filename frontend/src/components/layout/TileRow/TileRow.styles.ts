import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type TileRowStyleMap = ViewStyles<'row'>;

/**
 * The grid the home screen is laid out on.
 *
 * `stretch` rather than `flex-start`, because two tiles side by side whose
 * contents happen to differ in height would otherwise sit at different heights
 * and stop reading as a grid at all.
 */
export const createTileRowStyles = (theme: Theme): TileRowStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: theme.layout.cardGap,
    },
  });
