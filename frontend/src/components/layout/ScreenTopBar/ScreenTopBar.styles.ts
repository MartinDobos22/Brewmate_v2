import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ScreenTopBarStyleMap = ViewStyles<'bar'>;

/**
 * A row across the top of a screen holding the way back, and nothing else.
 *
 * It does not scroll with the content under it: the way back is the one thing
 * on a long screen somebody reaches for without having read anything, and a
 * button that had scrolled away four cards ago is not a way back. Aligned to
 * the screen's own edge, so the chevron sits on the same line as the title
 * under it.
 */
export const createScreenTopBarStyles = (theme: Theme): ScreenTopBarStyleMap =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      paddingHorizontal: theme.layout.screenEdge,
      paddingTop: theme.spacing.sm,
    },
  });
