import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewScreenStyleMap = ViewStyles<'submit' | 'extras' | 'failure'>;

export const createPreBrewScreenStyles = (theme: Theme): PreBrewScreenStyleMap =>
  StyleSheet.create({
    submit: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
    extras: { gap: theme.spacing.sm, marginTop: theme.spacing.lg },
    /** Three lines: what failed, what to do about it, and where to look it up. */
    failure: { gap: theme.spacing.xxs },
  });
