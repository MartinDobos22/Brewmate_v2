import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewPreviousRecipeStyleMap = ViewStyles<'wrapper' | 'actions'>;

export const createPreBrewPreviousRecipeStyles = (theme: Theme): PreBrewPreviousRecipeStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm },
    actions: { gap: theme.spacing.sm },
  });
