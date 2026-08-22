import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderOptionChipsStyleMap = ViewStyles<'wrapper' | 'row'>;

export const createGrinderOptionChipsStyles = (theme: Theme): GrinderOptionChipsStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
