import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type FormSectionStyleMap = ViewStyles<'espressoBox'>;

/**
 * A patch of the ground the signed-out screens are drawn on.
 *
 * The field takes a `ground` because those screens are dark in both colour
 * schemes, and a variant that can only be checked by signing out is one
 * nobody checks.
 */
export const createFormSectionStyles = (theme: Theme): FormSectionStyleMap =>
  StyleSheet.create({
    espressoBox: {
      padding: theme.spacing.lg,
      borderRadius: theme.shape.card,
      backgroundColor: theme.colors.espresso,
    },
  });
