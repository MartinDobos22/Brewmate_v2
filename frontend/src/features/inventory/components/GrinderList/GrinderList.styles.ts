import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderListStyleMap = ViewStyles<'content' | 'sheet'>;

/**
 * The catalogue reads as one continuous sheet of entries rather than as a
 * column of separate cards, which is why the surface belongs to the list and
 * the rows are transparent on it. A hundred cards each with their own shadow
 * is a screen with no hierarchy and a scroll that flickers.
 *
 * `overflow: hidden` is safe here and nowhere a card is drawn: this sheet
 * carries no depth, so there is no shadow for `masksToBounds` to remove - and
 * without it the first row's pressed fill prints square into a rounded
 * corner.
 */
export const createGrinderListStyles = (theme: Theme): GrinderListStyleMap =>
  StyleSheet.create({
    content: { paddingBottom: theme.spacing.xxl },
    sheet: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.shape.softCard,
      overflow: 'hidden',
    },
  });
