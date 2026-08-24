import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ImportReviewStepStyleMap = ViewStyles<'fields' | 'actions'>;

export const createImportReviewStepStyles = (theme: Theme): ImportReviewStepStyleMap =>
  StyleSheet.create({
    fields: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
