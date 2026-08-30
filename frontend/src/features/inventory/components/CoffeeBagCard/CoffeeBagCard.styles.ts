import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagCardStyleMap = ViewStyles<'body' | 'header' | 'actions'>;

export const createCoffeeBagCardStyles = (theme: Theme): CoffeeBagCardStyleMap =>
  StyleSheet.create({
    body: { gap: theme.spacing.sm },
    header: { gap: theme.spacing.xxs },
    /**
     * The one remaining action sits at the end of the row rather than filling
     * it. Archiving a bag is a thing somebody does once per bag, and a
     * full-width button would make it the card's headline.
     */
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.xs },
  });
