import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import type { ScreenGround } from './screenGrounds';

type ScreenStyleMap = ViewStyles<'root' | 'content' | 'padded' | 'grow' | ScreenGround>;

export const createScreenStyles = (theme: Theme): ScreenStyleMap =>
  StyleSheet.create({
    root: { flex: 1 },
    surface: { backgroundColor: theme.colors.background },
    /** Dark in both schemes, so it is read off the espresso block's own roles. */
    brew: { backgroundColor: theme.colors.brewGround },
    content: { flex: 1 },
    padded: { padding: theme.layout.screenEdge, gap: theme.layout.cardGap },
    grow: { flexGrow: 1 },
  });
