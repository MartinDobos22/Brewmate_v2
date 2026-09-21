import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ButtonsSectionStyleMap = ViewStyles<'espressoBox' | 'row'>;

/**
 * A patch of the ground the two espresso tones are meant for.
 *
 * A cream pill on a light card is the one combination this catalogue must not
 * make look reasonable, so it is never shown on one.
 */
export const createButtonsSectionStyles = (theme: Theme): ButtonsSectionStyleMap =>
  StyleSheet.create({
    espressoBox: {
      padding: theme.spacing.md,
      borderRadius: theme.shape.card,
      backgroundColor: theme.colors.espresso,
    },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.sm },
  });
