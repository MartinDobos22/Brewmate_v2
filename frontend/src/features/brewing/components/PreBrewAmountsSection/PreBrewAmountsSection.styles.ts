import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewAmountsSectionStyleMap = ViewStyles<'steppers' | 'notes'>;

export const createPreBrewAmountsSectionStyles = (theme: Theme): PreBrewAmountsSectionStyleMap =>
  StyleSheet.create({
    /**
     * One stepper per row, not two side by side.
     *
     * Two of them shared a wrapping row, which on a phone meant a 32-point
     * number, its unit and two 40-point buttons competing for about 150 points
     * - so the row wrapped, unwrapped and re-wrapped as the digits changed and
     * the whole card grew and shrank underneath the finger that was tapping
     * it. Stacked, each control has the width of the card whatever the number
     * says, and the ratio slider below stays exactly where it was put.
     */
    steppers: {
      gap: theme.spacing.lg,
      marginVertical: theme.spacing.md,
    },
    notes: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
  });
