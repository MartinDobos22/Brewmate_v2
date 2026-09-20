import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ProfileScreenStyleMap = ViewStyles<'content'>;

/**
 * The header holds what the app believes; everything under it is what can be
 * done about it.
 *
 * The chart moved into the header because it is the screen's headline rather
 * than a figure inside a card - the reader's own taste is the one thing this
 * screen is for, and it used to arrive as the third thing in a column.
 */
export const createProfileScreenStyles = (theme: Theme): ProfileScreenStyleMap =>
  StyleSheet.create({
    content: { padding: theme.spacing.lgPlus, gap: theme.spacing.lg },
  });
