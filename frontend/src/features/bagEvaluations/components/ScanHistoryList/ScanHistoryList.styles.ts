import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanHistoryListStyleMap = ViewStyles<'list' | 'meta'>;

export const createScanHistoryListStyles = (theme: Theme): ScanHistoryListStyleMap =>
  StyleSheet.create({
    list: { gap: theme.spacing.sm, marginTop: theme.spacing.lg },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.sm,
    },
  });
