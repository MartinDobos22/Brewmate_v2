import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagDetailStyleMap = ViewStyles<
  'header' | 'rows' | 'row' | 'chipRow' | 'chips' | 'recipeHead' | 'group' | 'recipes' | 'archive'
>;

export const createCoffeeBagDetailStyles = (theme: Theme): CoffeeBagDetailStyleMap =>
  StyleSheet.create({
    header: { gap: theme.spacing.xxs, paddingBottom: theme.spacing.xs },
    rows: { gap: theme.spacing.sm },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.md,
    },
    /**
     * A list of a roaster's own words, under its label rather than opposite
     * it: three or four chips have nowhere to go on the right-hand side of a
     * row that a farm name fits on.
     */
    chipRow: { gap: theme.spacing.xs },
    /** The label over the figures, which the card's own gap already spaces. */
    recipeHead: { flexDirection: 'row', justifyContent: 'space-between' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    group: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
    recipes: { gap: theme.spacing.sm },
    /**
     * Finishing a bag sits alone at the very bottom, quiet.
     *
     * It is a thing somebody does once per bag and never by accident, and at
     * the weight of the action above it - brewing - it would read as the other
     * half of a pair of equal choices.
     */
    archive: { alignItems: 'flex-end', marginTop: theme.spacing.lg },
  });
