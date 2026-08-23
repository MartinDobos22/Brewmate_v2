import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanHistoryListStyleMap = ViewStyles<'list'>;

export const createScanHistoryListStyles = (theme: Theme): ScanHistoryListStyleMap =>
  StyleSheet.create({
    list: { gap: theme.spacing.xs, marginTop: theme.spacing.lg },
  });
