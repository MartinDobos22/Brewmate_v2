import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanBagScreenStyleMap = ViewStyles<'content' | 'verdict'>;

/**
 * The verdict stage drops the title and the step strip the earlier ones carry.
 *
 * Everywhere else in this flow "how much more of this is there" is a fair
 * question, asked standing in a shop with a bag in one hand. Here it is
 * answered by the screen itself: an opinion, the argument for it, and one
 * question with two buttons. A strip above that would be counting a journey
 * that has arrived.
 */
export const createScanBagScreenStyles = (theme: Theme): ScanBagScreenStyleMap =>
  StyleSheet.create({
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
    /** Grows, so the outcome question can sit against the bottom edge. */
    verdict: { flexGrow: 1, gap: theme.spacing.lg },
  });
