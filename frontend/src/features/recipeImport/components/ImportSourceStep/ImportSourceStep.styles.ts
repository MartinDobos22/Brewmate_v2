import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ImportSourceStepStyleMap = ViewStyles<'actions'>;

/**
 * Three ways to hand this screen a recipe, stacked, all the same width.
 *
 * The photograph used to sit in a row of its own, and `fullWidth` is
 * `alignSelf: 'stretch'` - which stretches on the cross axis, so inside a row
 * it did nothing at all and the button shrank to its label. Three buttons at
 * three widths in one card read as three unrelated controls rather than as
 * three answers to one question.
 */
export const createImportSourceStepStyles = (theme: Theme): ImportSourceStepStyleMap =>
  StyleSheet.create({
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
