import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ColorSectionStyleMap = ViewStyles<'grid' | 'item' | 'swatch'>;

export const createColorSectionStyles = (theme: Theme): ColorSectionStyleMap =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    item: { gap: theme.spacing.xxs },
    swatch: {
      width: theme.size.swatchSize,
      height: theme.size.swatchSize,
      borderRadius: theme.shape.icon,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
    },
  });

/** The swatch colour is the token being shown, so it cannot be pre-baked. */
export const swatchFill = (backgroundColor: string): ViewStyle => ({ backgroundColor });
