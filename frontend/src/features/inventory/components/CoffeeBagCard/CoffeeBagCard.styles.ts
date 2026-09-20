import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagCardStyleMap = ViewStyles<
  'body' | 'facts' | 'heading' | 'chips' | 'status' | 'actions' | 'brew' | 'archive' | 'pressed'
>;

/**
 * A dial, the coffee beside it, and two things to do with it.
 *
 * The dial takes the left column at a fixed width because it is the same size
 * on every card: how much life a bag has left is not a quantity a card should
 * encode by being bigger, and two rings of different sizes on one screen would
 * read as exactly that claim.
 *
 * The brewing button grows and the archive button does not. Finishing a bag is
 * something somebody does once per bag, and at equal widths the destructive
 * one reads as the ordinary choice.
 */
export const createCoffeeBagCardStyles = (theme: Theme): CoffeeBagCardStyleMap =>
  StyleSheet.create({
    body: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.lg },
    facts: { flex: 1, minWidth: 0, gap: theme.spacing.sm },
    heading: { gap: theme.spacing.xxs },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    status: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    actions: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    brew: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.bagActionHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espresso,
    },
    archive: {
      alignItems: 'center',
      justifyContent: 'center',
      height: theme.size.bagActionHeight,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
