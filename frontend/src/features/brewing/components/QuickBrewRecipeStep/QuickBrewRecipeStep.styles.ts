import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type QuickBrewRecipeStepStyleMap = ViewStyles<'wrapper' | 'offer'>;

export const createQuickBrewRecipeStepStyles = (theme: Theme): QuickBrewRecipeStepStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    offer: { gap: theme.spacing.sm },
  });
