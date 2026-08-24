import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConstraintBadgeStyleMap = ViewStyles<'row' | 'badge'>;

export const createConstraintBadgesStyles = (theme: Theme): ConstraintBadgeStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xxs },
    /**
     * Outlined rather than filled. A cup brewed without a thermometer is a
     * fact about that morning, not a warning - and a row of solid red badges
     * down a history would read as a list of mistakes somebody made.
     */
    badge: {
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
      borderRadius: theme.shape.chip,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xxs,
    },
  });
