import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewAmountsSectionStyleMap = ViewStyles<'heading' | 'divider' | 'notes'>;

/**
 * The card the screen exists for, and the only one whose numbers are the
 * largest thing on the page.
 *
 * A hairline between the two weights rather than a gap: they are one
 * calculation read top to bottom, and a gap would make them two questions.
 */
export const createPreBrewAmountsSectionStyles = (theme: Theme): PreBrewAmountsSectionStyleMap =>
  StyleSheet.create({
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    divider: { height: theme.borderWidth.thin, backgroundColor: theme.colors.divider },
    notes: { gap: theme.spacing.xs },
  });
