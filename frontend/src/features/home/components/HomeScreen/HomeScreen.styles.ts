import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeScreenStyleMap = ViewStyles<'content' | 'cards'>;

/**
 * A dark block that reaches the glass, and a column of reports under it.
 *
 * The block holds the one thing the screen is for - what to brew, or the three
 * steps that come before there is anything to brew - and everything below it
 * reports. That order does not change as the account fills up: only what the
 * block is able to say does.
 */
export const createHomeScreenStyles = (theme: Theme): HomeScreenStyleMap =>
  StyleSheet.create({
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lg },
    cards: { flexDirection: 'row', gap: theme.spacing.md },
  });
