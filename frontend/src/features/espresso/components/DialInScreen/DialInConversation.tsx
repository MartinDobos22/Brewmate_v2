import { CHAT_ROLES, type RecipeChatMessage } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { CHAT_AUTHORS, ChatBubble } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';
import { RecipePatchCard } from '../../../chat/components';
import type { DialInSession } from '../../hooks';

import { createDialInScreenStyles } from './DialInScreen.styles';

export interface DialInConversationProps {
  readonly session: DialInSession;
}

/**
 * What has been said about this coffee, with each proposal under the sentence
 * that argued for it.
 *
 * The same shape the recipe chat uses, and the same rule: a proposal is stored
 * next to its reasoning and applied only when somebody taps. A dial-in where
 * the app quietly moved the grind would be one nobody could reconstruct
 * afterwards - and reconstructing it is exactly what the next answer does.
 */
export const DialInConversation = ({ session }: DialInConversationProps): JSX.Element => {
  const styles = useThemedStyles(createDialInScreenStyles);
  const recipe = session.recipe;

  return (
    <View style={styles.body}>
      {session.messages.map((message: RecipeChatMessage): JSX.Element => {
        const patch = message.recipePatch;

        return (
          <View key={message.id} style={styles.message}>
            <ChatBubble
              message={message.content}
              author={message.role === CHAT_ROLES.user ? CHAT_AUTHORS.user : CHAT_AUTHORS.assistant}
            />
            {patch === null || recipe === undefined ? null : (
              <RecipePatchCard
                patch={patch}
                current={recipe.params}
                isApplied={session.appliedMessageId === message.id}
                isApplying={session.isApplying}
                hasFailed={session.applyFailed}
                onApply={(): void => {
                  session.take(message.id, patch);
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
