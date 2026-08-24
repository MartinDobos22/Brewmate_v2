import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TimelineScreenStyleMap = ViewStyles<'intro' | 'list'>;

export const createTimelineScreenStyles = (theme: Theme): TimelineScreenStyleMap =>
  StyleSheet.create({
    intro: { gap: theme.spacing.xxs, marginBottom: theme.spacing.md },
    list: { gap: theme.spacing.md },
  });
