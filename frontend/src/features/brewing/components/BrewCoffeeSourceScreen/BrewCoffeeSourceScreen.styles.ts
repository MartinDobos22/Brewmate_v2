import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewCoffeeSourceStyleMap = ViewStyles<'choices' | 'options' | 'actions'>;

export const createBrewCoffeeSourceStyles = (theme: Theme): BrewCoffeeSourceStyleMap =>
  StyleSheet.create({
    choices: { gap: theme.spacing.md },
    options: { gap: theme.spacing.sm },
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  });
