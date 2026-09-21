import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanHeaderStyleMap = ViewStyles<'badge' | 'text'>;

/**
 * What the scanner is for, in the block at the top of it.
 *
 * The badge is the same glyph the home screen's own scanner button carries, so
 * somebody who pressed one arrives at the other and recognises it. Underneath,
 * the one sentence that makes this feature usable by an account that owns
 * nothing: no cupboard and no history are needed, only the label.
 */
export const createScanHeaderStyles = (theme: Theme): ScanHeaderStyleMap =>
  StyleSheet.create({
    badge: {
      width: theme.size.scanBadgeSize,
      height: theme.size.scanBadgeSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    text: { gap: theme.spacing.md },
  });
