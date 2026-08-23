import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderStepStyleMap = ViewStyles<'picker'>;

export const createGrinderStepStyles = (theme: Theme): GrinderStepStyleMap =>
  StyleSheet.create({
    /** The catalogue takes whatever is left under the heading and the list. */
    picker: { flex: 1, marginTop: theme.spacing.sm },
  });
