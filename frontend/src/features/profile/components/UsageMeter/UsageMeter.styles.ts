import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type UsageMeterStyleMap = ViewStyles<'wrapper' | 'row'>;

/**
 * One ceiling, measured.
 *
 * The label and the figure share a line with the figure pushed to the end,
 * because the two are read in opposite directions: the eye finds the label on
 * the left to know what is being counted and the number on the right to know
 * how much. Stacked, the figure would be the third line of a three-line block
 * and the bar under it a fourth.
 */
export const createUsageMeterStyles = (theme: Theme): UsageMeterStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  });
