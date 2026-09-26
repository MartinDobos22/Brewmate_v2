import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ScreenIntroStyleMap = ViewStyles<'wrapper'>;

/**
 * A screen's own title and the sentence under it.
 *
 * The gap is tighter than anything else on the screen, because these are one
 * statement rather than two: a title and its instruction read as a pair only
 * while they are closer to each other than to whatever follows. Everything
 * below is separated by the screen's own gap, which is what makes the intro
 * read as the top of the page rather than as its first card.
 */
export const createScreenIntroStyles = (theme: Theme): ScreenIntroStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
  });
