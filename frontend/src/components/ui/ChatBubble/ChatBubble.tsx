import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createChatBubbleStyles } from './ChatBubble.styles';
import { CHAT_AUTHORS, type ChatAuthor } from './chatBubbleAuthors';
import { CHAT_ASSISTANT_ICON } from './chatBubbleIcons';

export interface ChatBubbleProps {
  readonly message: string;
  readonly author: ChatAuthor;
}

export const ChatBubble = ({ message, author }: ChatBubbleProps): JSX.Element => {
  const styles = useThemedStyles(createChatBubbleStyles);
  const theme = useTheme();
  const isUser = author === CHAT_AUTHORS.user;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {isUser ? null : (
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name={CHAT_ASSISTANT_ICON}
            size={theme.size.iconSmall}
            color={theme.colors.accentOnEspresso}
          />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text variant="bodyText" tone={isUser ? 'onEspresso' : 'default'}>
          {message}
        </Text>
      </View>
    </View>
  );
};
