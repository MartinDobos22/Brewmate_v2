import { StyleSheet, type ViewStyle } from 'react-native';

import type { ColorPalette, Theme, ViewStyles } from '../../../theme';

type StateMarkStyleMap = ViewStyles<'wrapper'>;

/**
 * The app's own ring motif, unfilled.
 *
 * Drawn from the same borders and radii as every other decoration here rather
 * than shipped as an illustration: this app carries no artwork, and a picture
 * of an empty shelf would be right in one colour scheme and wrong in the other
 * from the day it was added. Dashed because that is what the outline of
 * something absent looks like without having to say so.
 */
export const createStateMarkStyles = (theme: Theme): StateMarkStyleMap =>
  StyleSheet.create({
    wrapper: {
      width: theme.size.emptyMarkOuter,
      height: theme.size.emptyMarkOuter,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

/** One ring, sized and painted at runtime because both vary by call. */
export const stateMarkRing = (
  theme: Theme,
  diameter: number,
  color: keyof ColorPalette,
): ViewStyle => ({
  position: 'absolute',
  width: diameter,
  height: diameter,
  borderRadius: theme.shape.pill,
  borderWidth: theme.borderWidth.thick,
  borderStyle: 'dashed',
  borderColor: theme.colors[color],
});
