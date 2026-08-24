import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ChatComposerStyleMap = ViewStyles<'wrapper'>;

export const createChatComposerStyles = (theme: Theme): ChatComposerStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md, marginTop: theme.spacing.lg },
  });
