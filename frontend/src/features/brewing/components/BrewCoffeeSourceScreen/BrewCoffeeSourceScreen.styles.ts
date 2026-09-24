import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewCoffeeSourceStyleMap = ViewStyles<'content' | 'choices' | 'options' | 'actions'>;

export const createBrewCoffeeSourceStyles = (theme: Theme): BrewCoffeeSourceStyleMap =>
  StyleSheet.create({
    /** Under the block, which starts at the glass and takes neither edge. */
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lgPlus },
    choices: { gap: theme.spacing.md },
    options: { gap: theme.spacing.sm },
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  });
