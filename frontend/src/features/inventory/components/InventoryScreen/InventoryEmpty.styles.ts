import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InventoryEmptyStyleMap = ViewStyles<'wrapper' | 'figure' | 'words' | 'ways'>;

export const createInventoryEmptyStyles = (theme: Theme): InventoryEmptyStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xl },
    figure: { alignItems: 'center', gap: theme.spacing.lg, paddingTop: theme.spacing.xxl },
    /** Held to a width that breaks into even lines rather than running the phone. */
    words: { alignItems: 'center', gap: theme.spacing.sm, maxWidth: theme.size.emptyBodyMaxWidth },
    ways: { gap: theme.spacing.sm },
  });
