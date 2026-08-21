import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ShapeSectionStyleMap = ViewStyles<'item' | 'box'>;

export const createShapeSectionStyles = (theme: Theme): ShapeSectionStyleMap =>
  StyleSheet.create({
    item: { alignItems: 'center', gap: theme.spacing.xs },
    box: {
      width: theme.size.swatchSize,
      height: theme.size.swatchSize,
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
    },
  });

/** The radius is the token being demonstrated. */
export const boxRadius = (borderRadius: number): ViewStyle => ({ borderRadius });
