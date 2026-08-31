import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewCoffeeSectionStyleMap = ViewStyles<'options' | 'freeText' | 'chosen'>;

export const createPreBrewCoffeeSectionStyles = (theme: Theme): PreBrewCoffeeSectionStyleMap =>
  StyleSheet.create({
    options: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    chosen: { gap: theme.spacing.xs, marginTop: theme.spacing.sm },
    freeText: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
