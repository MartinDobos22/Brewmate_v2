import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ChipStyleMap = ViewStyles<'base' | 'unselected' | 'selected' | 'pressed' | 'disabled'>;

/** Chips get radius 8 - the small end of the scale, still never a pill. */
export const createChipStyles = (theme: Theme): ChipStyleMap =>
  StyleSheet.create({
    base: {
      height: theme.size.chipHeight,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.shape.chip,
      borderWidth: theme.borderWidth.thin,
    },
    unselected: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outlineVariant,
    },
    selected: {
      backgroundColor: theme.colors.secondaryContainer,
      borderColor: theme.colors.secondaryContainer,
    },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { backgroundColor: theme.colors.disabled, borderColor: theme.colors.disabled },
  });
