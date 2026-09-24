import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ImportRecipeScreenStyleMap = ViewStyles<'content' | 'result'>;

/**
 * Everything under the block takes the screen's own edge, which the block
 * itself does not: it starts at the glass and runs to both sides.
 */
export const createImportRecipeScreenStyles = (theme: Theme): ImportRecipeScreenStyleMap =>
  StyleSheet.create({
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
    result: { gap: theme.spacing.md },
  });
