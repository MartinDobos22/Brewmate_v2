import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ImportSourceStepStyleMap = ViewStyles<'actions' | 'photoRow'>;

export const createImportSourceStepStyles = (theme: Theme): ImportSourceStepStyleMap =>
  StyleSheet.create({
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
    photoRow: { flexDirection: 'row', gap: theme.spacing.sm },
  });
