import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ShotTimelineCardStyleMap = ViewStyles<'list' | 'entry' | 'facts'>;

export const createShotTimelineCardStyles = (theme: Theme): ShotTimelineCardStyleMap =>
  StyleSheet.create({
    list: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    entry: { gap: theme.spacing.xxs },
    facts: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
