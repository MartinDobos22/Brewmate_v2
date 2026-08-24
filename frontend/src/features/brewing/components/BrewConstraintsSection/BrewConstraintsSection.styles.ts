import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewConstraintsStyleMap = ViewStyles<
  'header' | 'list' | 'row' | 'box' | 'boxChecked' | 'rowText'
>;

export const createBrewConstraintsSectionStyles = (theme: Theme): BrewConstraintsStyleMap =>
  StyleSheet.create({
    header: {
      gap: theme.spacing.xxs,
    },
    list: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      minHeight: theme.size.minTouchTarget,
    },
    box: {
      width: theme.size.iconMedium,
      height: theme.size.iconMedium,
      borderRadius: theme.shape.checkbox,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    rowText: {
      flex: 1,
      gap: theme.spacing.xxs,
    },
  });
