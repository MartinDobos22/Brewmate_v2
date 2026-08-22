import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type SheetStyleMap = ViewStyles<'backdrop' | 'scrim' | 'panel' | 'handle' | 'header' | 'content'>;

/**
 * The sheet is one of the three things in the app that genuinely floats, so it
 * is one of the three things that carries a shadow.
 */
export const createSheetStyles = (theme: Theme): SheetStyleMap =>
  StyleSheet.create({
    backdrop: { flex: 1, justifyContent: 'flex-end' },
    scrim: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.scrim,
    },
    panel: {
      maxHeight: theme.relativeSize.sheetMaxHeight,
      borderTopLeftRadius: theme.shape.sheet,
      borderTopRightRadius: theme.shape.sheet,
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.xl,
      shadowColor: theme.colors.shadow,
      ...theme.elevation.overlay,
    },
    handle: {
      width: theme.size.sheetHandleWidth,
      height: theme.size.sheetHandleHeight,
      alignSelf: 'center',
      marginTop: theme.spacing.md,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.outlineVariant,
    },
    header: { paddingHorizontal: theme.layout.screenEdge, paddingTop: theme.spacing.lg },
    content: {
      paddingHorizontal: theme.layout.screenEdge,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.md,
      /** Lets tall content scroll inside the panel instead of past its edge. */
      flexShrink: 1,
    },
  });
