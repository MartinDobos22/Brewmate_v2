import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ScreenStyleMap = ViewStyles<'root' | 'content' | 'padded' | 'grow'>;

export const createScreenStyles = (theme: Theme): ScreenStyleMap =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1 },
    padded: { padding: theme.layout.screenEdge, gap: theme.layout.cardGap },
    grow: { flexGrow: 1 },
  });
