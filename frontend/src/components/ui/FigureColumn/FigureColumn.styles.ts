import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type FigureColumnStyleMap = ViewStyles<'row' | 'column' | 'rule'>;

/**
 * The three numbers a recipe is made of, read left to right as one statement:
 * this much coffee into this much water, and therefore this ratio.
 *
 * Equal columns separated by a hairline rather than by space, because gaps
 * alone would let three unrelated numbers sit in a row - and the rule is what
 * says the third is arithmetic over the first two.
 */
export const createFigureColumnStyles = (theme: Theme): FigureColumnStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-end' },
    column: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    rule: {
      width: theme.borderWidth.thin,
      height: theme.size.headerRuleHeight,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.espressoLine,
    },
  });
