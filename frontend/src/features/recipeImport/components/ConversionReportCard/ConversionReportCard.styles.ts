import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConversionReportCardStyleMap = ViewStyles<'notes' | 'note' | 'header'>;

export const createConversionReportCardStyles = (theme: Theme): ConversionReportCardStyleMap =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    notes: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    note: { gap: theme.spacing.xs },
  });
