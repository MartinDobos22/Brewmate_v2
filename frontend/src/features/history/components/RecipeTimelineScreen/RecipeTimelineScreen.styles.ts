import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TimelineScreenStyleMap = ViewStyles<'intro' | 'list'>;

/**
 * The versions hang off one rail, so the gap between them is the rail rather
 * than a gutter: a list of cards with air between them is a list, and this is
 * meant to be read downwards as one thing that happened.
 */
export const createTimelineScreenStyles = (theme: Theme): TimelineScreenStyleMap =>
  StyleSheet.create({
    intro: { gap: theme.spacing.xs, marginBottom: theme.spacing.xs },
    list: { gap: theme.spacing.lgPlus },
  });
