import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagVerdictCardStyleMap = ViewStyles<'section' | 'points'>;

export const createBagVerdictCardStyles = (theme: Theme): BagVerdictCardStyleMap =>
  StyleSheet.create({
    section: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
    points: { gap: theme.spacing.xxs },
  });
