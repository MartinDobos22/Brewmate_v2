import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type QuickBrewCoffeeStepStyleMap = ViewStyles<'wrapper' | 'field' | 'roasts'>;

/**
 * The question is a card; the two buttons under it are not.
 *
 * Everything asked here belongs to one question - what the drinker happens to
 * know about the beans - and it was a column of loose elements on the screen
 * itself, which is how a form looked before this app had cards. What it is
 * not part of is the flow: going on and going back are things done to the
 * screen rather than answers on it, so they stay outside.
 *
 * The roast label and its chips are one child of that card, because the
 * card's own gap is sixteen and a label sitting that far from what it labels
 * has stopped labelling it.
 */
export const createQuickBrewCoffeeStepStyles = (theme: Theme): QuickBrewCoffeeStepStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    field: { gap: theme.spacing.xs },
    roasts: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
