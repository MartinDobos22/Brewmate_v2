import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagRatingSheetStyleMap = ViewStyles<'scroll' | 'body' | 'group' | 'chips' | 'actions'>;

/** Stars first, then the two optional questions, then the button. */
export const createBagRatingSheetStyles = (theme: Theme): BagRatingSheetStyleMap =>
  StyleSheet.create({
    scroll: { flexGrow: 0 },
    body: { gap: theme.spacing.lg, paddingBottom: theme.spacing.sm },
    group: { gap: theme.spacing.sm },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    actions: { gap: theme.spacing.sm },
  });
