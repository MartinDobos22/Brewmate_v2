import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type QuickBrewCoffeeStepStyleMap = ViewStyles<'wrapper' | 'roasts'>;

export const createQuickBrewCoffeeStepStyles = (theme: Theme): QuickBrewCoffeeStepStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    roasts: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
