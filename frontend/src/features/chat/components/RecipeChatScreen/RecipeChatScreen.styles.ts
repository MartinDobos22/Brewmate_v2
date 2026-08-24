import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipeChatScreenStyleMap = ViewStyles<'wrapper' | 'message' | 'save'>;

export const createRecipeChatScreenStyles = (theme: Theme): RecipeChatScreenStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    message: { gap: theme.spacing.sm },
    save: { gap: theme.spacing.sm, marginTop: theme.spacing.xl },
  });
