import { StyleSheet, type ViewStyle } from 'react-native';

import type { ElevationStyle, Theme, ViewStyles } from '../../../../theme';

type ElevationSectionStyleMap = ViewStyles<'item' | 'box'>;

export const createElevationSectionStyles = (theme: Theme): ElevationSectionStyleMap =>
  StyleSheet.create({
    item: { alignItems: 'center', gap: theme.spacing.xs },
    box: {
      width: theme.size.swatchSize,
      height: theme.size.swatchSize,
      borderRadius: theme.shape.card,
      backgroundColor: theme.colors.surface,
    },
  });

/** The shadow is the token being demonstrated. */
export const elevationStyle = (shadowColor: string, elevation: ElevationStyle): ViewStyle => ({
  shadowColor,
  ...elevation,
});
