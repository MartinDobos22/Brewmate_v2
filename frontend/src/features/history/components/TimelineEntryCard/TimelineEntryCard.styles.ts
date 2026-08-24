import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TimelineEntryStyleMap = ViewStyles<'header' | 'numbers' | 'note' | 'counts' | 'body'>;

export const createTimelineEntryStyles = (theme: Theme): TimelineEntryStyleMap =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    numbers: { flexDirection: 'row', gap: theme.spacing.lg, marginBottom: theme.spacing.xs },
    /**
     * The quoted note is set off by a rule rather than by a bubble: it is
     * something the person wrote, and the card around it is the app talking.
     */
    note: {
      borderLeftWidth: theme.borderWidth.thick,
      borderLeftColor: theme.colors.outlineVariant,
      paddingLeft: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    counts: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xs },
    body: { gap: theme.spacing.xxs },
  });
