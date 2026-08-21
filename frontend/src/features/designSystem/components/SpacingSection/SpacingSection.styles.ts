import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SpacingSectionStyleMap = ViewStyles<'row' | 'bar'>;

export const createSpacingSectionStyles = (theme: Theme): SpacingSectionStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    bar: {
      height: theme.size.iconSmall,
      borderRadius: theme.shape.icon,
      backgroundColor: theme.colors.secondaryContainer,
    },
  });

/** The bar length is the spacing value itself. */
export const barWidth = (width: number): ViewStyle => ({ width });
