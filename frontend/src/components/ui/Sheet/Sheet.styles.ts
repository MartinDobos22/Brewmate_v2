import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type SheetStyleMap = ViewStyles<
  'backdrop' | 'scrim' | 'panel' | 'filled' | 'handle' | 'header' | 'content' | 'contentFilled'
>;

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
    /**
     * A definite height, which is the whole difference for a virtualised list:
     * `maxHeight` alone leaves the panel sizing to its content, and a child
     * asking "how tall may I be" gets no answer and collapses.
     */
    filled: { height: theme.relativeSize.sheetMaxHeight },
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
    /**
     * The other half of `fill`, and the half that was missing.
     *
     * Giving the panel a height achieves nothing on its own while the content
     * area still sizes itself to its children: a child asking for `flex: 1`
     * contributes nothing to that measurement, so the content resolved to no
     * height, the list inside it to no height, and a sheet built to hold a
     * catalogue opened showing a search box and empty space. The panel's
     * height only reaches the list if every view between them passes it on.
     */
    contentFilled: { flexGrow: 1 },
  });
