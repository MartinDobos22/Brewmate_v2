import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewScreenStyleMap = ViewStyles<'submit' | 'extras'>;

export const createPreBrewScreenStyles = (theme: Theme): PreBrewScreenStyleMap =>
  StyleSheet.create({
    submit: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
    extras: { gap: theme.spacing.sm, marginTop: theme.spacing.lg },
  });
