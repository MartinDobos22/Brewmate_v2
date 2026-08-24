import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ChatQuickChipsStyleMap = ViewStyles<'row'>;

export const createChatQuickChipsStyles = (theme: Theme): ChatQuickChipsStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
