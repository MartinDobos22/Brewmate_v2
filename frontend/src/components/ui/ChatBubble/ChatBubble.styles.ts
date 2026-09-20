import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ChatBubbleStyleMap = ViewStyles<
  'row' | 'rowUser' | 'rowAssistant' | 'avatar' | 'bubble' | 'user' | 'assistant'
>;

/**
 * The bubble keeps the soft radius on three corners and tightens the fourth,
 * which is what gives a conversation its direction without adding a tail.
 *
 * Brewmate's side carries the surface and a shadow rather than a fill of its
 * own: on a warm ground a second tinted bubble would compete with the one the
 * person wrote, and what has to be told apart here is who spoke, not how
 * loudly. The avatar sits on the baseline of the bubble rather than at its
 * top, so a mark beside a single line and a mark beside six sit in the same
 * place relative to the last thing said.
 */
export const createChatBubbleStyles = (theme: Theme): ChatBubbleStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignSelf: 'stretch', gap: theme.spacing.sm },
    rowUser: { justifyContent: 'flex-end' },
    rowAssistant: { justifyContent: 'flex-start', alignItems: 'flex-end' },
    avatar: {
      width: theme.size.chatAvatarSize,
      height: theme.size.chatAvatarSize,
      borderRadius: theme.shape.avatar,
      backgroundColor: theme.colors.espresso,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 0,
      flexShrink: 0,
    },
    bubble: {
      maxWidth: theme.relativeSize.chatBubbleMaxWidth,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.shape.bubble,
    },
    user: {
      backgroundColor: theme.colors.espresso,
      borderBottomRightRadius: theme.shape.bubbleTail,
    },
    assistant: {
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.shape.bubbleTail,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
  });
