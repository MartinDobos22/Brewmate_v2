import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConfidenceIndicatorStyleMap = ViewStyles<'row' | 'body' | 'title'>;

/**
 * How much of the profile above is actually earned, as a dial and a sentence.
 *
 * The ring is the same object the cupboard draws a bag's freshness with, at
 * the smaller of its two sizes - both answer the same shape of question, and
 * two rings drawn separately would drift apart within a release.
 *
 * The brew count sits inside it, because it is the honest half: "celkom
 * slušne" built from a questionnaire and no brews means something different
 * from the same word after twenty cups, and the reader can see which one they
 * are looking at without being told.
 */
export const createConfidenceIndicatorStyles = (theme: Theme): ConfidenceIndicatorStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.espressoDeep,
    },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    title: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  });
