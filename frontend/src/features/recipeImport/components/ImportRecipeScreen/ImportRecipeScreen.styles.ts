import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ImportRecipeScreenStyleMap = ViewStyles<'result'>;

export const createImportRecipeScreenStyles = (theme: Theme): ImportRecipeScreenStyleMap =>
  StyleSheet.create({
    result: { gap: theme.spacing.md },
  });
