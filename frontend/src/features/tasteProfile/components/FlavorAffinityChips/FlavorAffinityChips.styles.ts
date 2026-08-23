import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type FlavorAffinityChipsStyleMap = ViewStyles<'row' | 'chip' | 'liked' | 'disliked'>;

export const createFlavorAffinityChipsStyles = (theme: Theme): FlavorAffinityChipsStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    chip: {
      height: theme.size.chipHeight,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.shape.chip,
      borderWidth: theme.borderWidth.thin,
    },
    liked: {
      backgroundColor: theme.colors.secondaryContainer,
      borderColor: theme.colors.secondaryContainer,
    },
    disliked: { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
  });
