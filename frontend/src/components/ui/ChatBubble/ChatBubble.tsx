import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createChatBubbleStyles } from './ChatBubble.styles';
import { CHAT_AUTHORS, type ChatAuthor } from './chatBubbleAuthors';

export interface ChatBubbleProps {
  readonly message: string;
  readonly author: ChatAuthor;
}

export const ChatBubble = ({ message, author }: ChatBubbleProps): JSX.Element => {
  const styles = useThemedStyles(createChatBubbleStyles);
  const isUser = author === CHAT_AUTHORS.user;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text variant="bodyMedium">{message}</Text>
      </View>
    </View>
  );
};
