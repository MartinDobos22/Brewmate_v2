import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewConstraintsStyleMap = ViewStyles<
  | 'header'
  | 'headerPressed'
  | 'headerText'
  | 'summary'
  | 'list'
  | 'row'
  | 'box'
  | 'boxChecked'
  | 'rowText'
>;

export const createBrewConstraintsSectionStyles = (theme: Theme): BrewConstraintsStyleMap =>
  StyleSheet.create({
    /** The same row shape as a closed dropdown, because that is what it is. */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      minHeight: theme.size.minTouchTarget,
    },
    headerPressed: { opacity: theme.opacity.pressed },
    headerText: { flexShrink: 1, flexGrow: 1, flexBasis: 0, gap: theme.spacing.xxs },
    /** What is ticked, readable without opening the section. */
    summary: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
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
