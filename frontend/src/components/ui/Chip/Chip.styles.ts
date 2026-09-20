import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ChipStyleMap = ViewStyles<
  'base' | 'unselected' | 'selected' | 'pressed' | 'disabled' | 'attribute'
>;

/**
 * Two kinds of chip, and the difference is whether it answers anything.
 *
 * A filter chip is a control - radius 8, the small end of the scale, still
 * never a pill - and it is what this component has always been. An attribute
 * chip states a fact about the thing it sits on, and the redesign draws those
 * as small pills on the secondary surface: nothing to press, nothing to
 * choose, so nothing that should look like either.
 */
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
    attribute: {
      height: theme.size.attributeChipHeight,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.shape.pill,
      borderWidth: theme.borderWidth.none,
      backgroundColor: theme.colors.surfaceVariant,
    },
  });
