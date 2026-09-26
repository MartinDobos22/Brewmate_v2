import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConstraintBadgeStyleMap = ViewStyles<'row' | 'badge' | 'lead'>;

/**
 * What was missing when this cup was made.
 *
 * The first badge is the statement - something was missing - and the ones
 * after it name what. Only the first carries the caution tone: a row of nine
 * ochre pills would read as a list of mistakes somebody made, and a cabin
 * morning is a fact about that morning rather than an error.
 *
 * Filled rather than outlined now, because they sit inside a card that has no
 * borders of its own: an outline here would be the only hairline on the
 * screen and would read as a control.
 */
export const createConstraintBadgesStyles = (theme: Theme): ConstraintBadgeStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      height: theme.size.constraintBadgeHeight,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    lead: { backgroundColor: theme.colors.cautionContainer },
  });
