import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewScreenStyleMap = ViewStyles<'root' | 'scroll' | 'content' | 'extras' | 'failure'>;

/**
 * A scroll with a bar against the bottom edge that does not move with it.
 *
 * The plan and the button are what the whole screen is for, and a screen where
 * they scroll away is one somebody has to go looking for the end of. So the
 * questions scroll and the commitment does not.
 */
export const createPreBrewScreenStyles = (theme: Theme): PreBrewScreenStyleMap =>
  StyleSheet.create({
    root: { flex: 1 },
    scroll: { flex: 1 },
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
    extras: { gap: theme.spacing.sm },
    /** Three lines: what failed, what to do about it, and where to look it up. */
    failure: { gap: theme.spacing.xxs },
  });
