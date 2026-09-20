import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipeChatHeaderStyleMap = ViewStyles<
  'method' | 'name' | 'version' | 'figures' | 'figure' | 'rule'
>;

/**
 * What the conversation is about, in the block at the top of the screen.
 *
 * It used to be the first card of the scroll, which meant that halfway through
 * arguing about grind the dose being argued over had scrolled off the top and
 * the only way to see it was to leave the conversation - exactly when somebody
 * stops describing their coffee and starts guessing. In the header it cannot
 * scroll away.
 *
 * The three figures are given equal columns and separated by a hairline rather
 * than by space, because they are one statement read left to right - this much
 * coffee, this much water, and therefore this ratio - and gaps alone would let
 * them read as three unrelated numbers.
 */
export const createRecipeChatHeaderStyles = (theme: Theme): RecipeChatHeaderStyleMap =>
  StyleSheet.create({
    method: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    name: { flex: 1, minWidth: 0 },
    version: {
      height: theme.size.attributeChipHeight,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoDeep,
    },
    figures: { flexDirection: 'row', alignItems: 'flex-end' },
    figure: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    rule: {
      width: theme.borderWidth.thin,
      height: theme.size.headerRuleHeight,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.espressoLine,
    },
  });
