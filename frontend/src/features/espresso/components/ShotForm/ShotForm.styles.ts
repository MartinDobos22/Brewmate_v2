import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ShotFormStyleMap = ViewStyles<'row' | 'field' | 'actions'>;

export const createShotFormStyles = (theme: Theme): ShotFormStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    field: { flex: 1 },
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
