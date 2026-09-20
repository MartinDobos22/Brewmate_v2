import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewMethodSectionStyleMap = ViewStyles<
  | 'wrapper'
  | 'heading'
  | 'pair'
  | 'card'
  | 'selected'
  | 'unselected'
  | 'cardHead'
  | 'cardBody'
  | 'empty'
  | 'pressed'
>;

/**
 * The brewers the cupboard vouches for, as cards, with the catalogue under
 * them.
 *
 * Choosing a brewer is the most visual decision in the app - a V60 and a moka
 * pot are different objects, not different words - so the ones somebody owns
 * get a picture each. The rest stay a field, because eighteen of them stacked
 * as cards put the dose, the ratio and the grind four scrolls below the top of
 * the screen, which is what the dropdown was introduced to fix.
 */
export const createPreBrewMethodSectionStyles = (theme: Theme): PreBrewMethodSectionStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xxs,
    },
    pair: { flexDirection: 'row', gap: theme.spacing.md },
    card: {
      flexGrow: 1,
      flexBasis: 0,
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
      shadowColor: theme.colors.espresso,
    },
    selected: { backgroundColor: theme.colors.espresso, ...theme.elevation.buttonDark },
    unselected: { backgroundColor: theme.colors.surface, ...theme.elevation.card },
    cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardBody: { gap: theme.spacing.xxs },
    empty: { gap: theme.spacing.xs },
    pressed: { opacity: theme.opacity.pressed },
  });
