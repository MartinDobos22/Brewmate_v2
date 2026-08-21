import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SchemePreviewStyleMap = ViewStyles<'column' | 'inner'>;

export const createSchemePreviewStyles = (theme: Theme): SchemePreviewStyleMap =>
  StyleSheet.create({
    column: { flex: 1, backgroundColor: theme.colors.background },
    inner: { padding: theme.layout.screenEdge, gap: theme.spacing.md },
  });
