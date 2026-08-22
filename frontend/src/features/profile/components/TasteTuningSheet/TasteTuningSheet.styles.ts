import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteTuningSheetStyleMap = ViewStyles<'scroll' | 'content'>;

export const createTasteTuningSheetStyles = (theme: Theme): TasteTuningSheetStyleMap =>
  StyleSheet.create({
    /** The sheet caps its own height, so five sliders scroll inside it. */
    scroll: { flexShrink: 1 },
    content: { gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  });
