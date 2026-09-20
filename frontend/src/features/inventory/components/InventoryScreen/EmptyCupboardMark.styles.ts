import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EmptyCupboardMarkStyleMap = ViewStyles<'wrapper' | 'outer' | 'inner'>;

/**
 * The app's own ring motif, unfilled.
 *
 * Drawn from the same borders and radii as every other decoration here rather
 * than shipped as an illustration: this app carries no artwork, and a picture
 * of an empty shelf would be right in one colour scheme and wrong in the other
 * from the day it was added. Dashed because that is what an outline of
 * something absent looks like without having to say so.
 */
export const createEmptyCupboardMarkStyles = (theme: Theme): EmptyCupboardMarkStyleMap =>
  StyleSheet.create({
    wrapper: {
      width: theme.size.emptyMarkOuter,
      height: theme.size.emptyMarkOuter,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outer: {
      position: 'absolute',
      width: theme.size.emptyMarkOuter,
      height: theme.size.emptyMarkOuter,
      borderRadius: theme.shape.pill,
      borderWidth: theme.borderWidth.thick,
      borderStyle: 'dashed',
      borderColor: theme.colors.outlineDashed,
    },
    inner: {
      position: 'absolute',
      width: theme.size.emptyMarkInner,
      height: theme.size.emptyMarkInner,
      borderRadius: theme.shape.pill,
      borderWidth: theme.borderWidth.thick,
      borderStyle: 'dashed',
      borderColor: theme.colors.outlineFaint,
    },
  });
