import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewControlsStyleMap = ViewStyles<'row' | 'primary' | 'secondary'>;

export const createBrewControlsStyles = (theme: Theme): BrewControlsStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    primary: {
      flex: 1,
      minHeight: theme.size.brewPrimaryControlSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.button,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
    },
    secondary: {
      minWidth: theme.size.brewControlSize,
      minHeight: theme.size.brewControlSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.button,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outline,
      paddingHorizontal: theme.spacing.md,
    },
  });
