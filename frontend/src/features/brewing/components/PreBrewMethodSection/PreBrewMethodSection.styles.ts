import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewMethodSectionStyleMap = ViewStyles<'options' | 'empty'>;

export const createPreBrewMethodSectionStyles = (theme: Theme): PreBrewMethodSectionStyleMap =>
  StyleSheet.create({
    options: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    empty: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  });
