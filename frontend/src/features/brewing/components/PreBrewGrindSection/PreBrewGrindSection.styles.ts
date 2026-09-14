import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewGrindSectionStyleMap = ViewStyles<'rows' | 'row' | 'note'>;

export const createPreBrewGrindSectionStyles = (theme: Theme): PreBrewGrindSectionStyleMap =>
  StyleSheet.create({
    rows: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    row: { gap: theme.spacing.xs },
    note: { marginTop: theme.spacing.sm },
  });
