import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagRatingCardStyleMap = ViewStyles<'row' | 'words' | 'stars'>;

/** One line per moment a bag is rated: when, how many stars, and the way to change it. */
export const createBagRatingCardStyles = (theme: Theme): BagRatingCardStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    words: { flex: 1, gap: theme.spacing.xxs },
    stars: { flexDirection: 'row', gap: theme.spacing.xxs },
  });
