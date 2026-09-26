import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ShotTimelineCardStyleMap = ViewStyles<'list' | 'entry' | 'facts' | 'trend'>;

export const createShotTimelineCardStyles = (theme: Theme): ShotTimelineCardStyleMap =>
  StyleSheet.create({
    list: { gap: theme.spacing.sm },
    entry: { gap: theme.spacing.xxs },
    facts: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    /** The arrow and what it means are one statement, so they sit tighter. */
    trend: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  });
