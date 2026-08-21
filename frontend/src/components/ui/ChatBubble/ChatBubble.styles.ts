import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ChatBubbleStyleMap = ViewStyles<
  'row' | 'rowUser' | 'rowAssistant' | 'bubble' | 'user' | 'assistant'
>;

/**
 * The bubble keeps the card radius on three corners and tightens the fourth,
 * which is what gives a conversation its direction without adding a tail.
 */
export const createChatBubbleStyles = (theme: Theme): ChatBubbleStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignSelf: 'stretch' },
    rowUser: { justifyContent: 'flex-end' },
    rowAssistant: { justifyContent: 'flex-start' },
    bubble: {
      maxWidth: theme.relativeSize.chatBubbleMaxWidth,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.shape.card,
    },
    user: {
      backgroundColor: theme.colors.primaryContainer,
      borderBottomRightRadius: theme.radius.xs,
    },
    assistant: {
      backgroundColor: theme.colors.surfaceContainer,
      borderBottomLeftRadius: theme.radius.xs,
    },
  });
