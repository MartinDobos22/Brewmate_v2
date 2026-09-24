import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConversionReportCardStyleMap = ViewStyles<'notes' | 'note' | 'noteHeading'>;

/**
 * One note per number, listed rather than folded away - the card's own gap
 * separates the heading, the caveat about the grind and the list itself.
 */
export const createConversionReportCardStyles = (theme: Theme): ConversionReportCardStyleMap =>
  StyleSheet.create({
    notes: { gap: theme.spacing.md },
    note: { gap: theme.spacing.xxs },
    /** The mark and what it classifies are one line. */
    noteHeading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  });
