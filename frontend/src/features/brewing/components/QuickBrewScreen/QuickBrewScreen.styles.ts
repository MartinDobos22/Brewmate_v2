import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type QuickBrewScreenStyleMap = ViewStyles<'content'>;

/**
 * Everything under the block takes the screen's own edge, which the block
 * itself does not: it starts at the glass and runs to both sides.
 */
export const createQuickBrewScreenStyles = (theme: Theme): QuickBrewScreenStyleMap =>
  StyleSheet.create({
    content: { flexGrow: 1, padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
  });
