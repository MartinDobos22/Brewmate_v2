import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ImportTargetStepStyleMap = ViewStyles<'sections' | 'actions'>;

export const createImportTargetStepStyles = (theme: Theme): ImportTargetStepStyleMap =>
  StyleSheet.create({
    sections: { gap: theme.spacing.md },
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
