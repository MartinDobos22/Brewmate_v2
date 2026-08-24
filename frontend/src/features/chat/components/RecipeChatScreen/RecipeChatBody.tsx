import {
  CHAT_ROLES,
  hasAnyConstraint,
  type Recipe,
  type RecipeChatMessage,
} from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { CHAT_AUTHORS, ChatBubble, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { RecipeConversation } from '../../hooks';
import { ChatComposer } from '../ChatComposer';
import { RecipePatchCard } from '../RecipePatchCard';

import { createRecipeChatScreenStyles } from './RecipeChatScreen.styles';
import { RecipeChatSaveRow } from './RecipeChatSaveRow';

export interface RecipeChatBodyProps {
  readonly recipe: Recipe;
  readonly conversation: RecipeConversation;
}

const NOTHING = 0;
const NO_CONSTRAINTS = {};

/**
 * The exchange, with each proposal drawn under the sentence that argued for it.
 *
 * The patch card belongs to its message rather than floating at the bottom of
 * the screen, because a conversation can carry several and only one of them is
 * the answer to what somebody just said. Reading the reason and then the
 * numbers directly beneath it is the whole point.
 *
 * The opening question is written by the app rather than fetched, so the
 * screen never starts empty - and it says out loud that a sentence is enough.
 */
export const RecipeChatBody = ({ recipe, conversation }: RecipeChatBodyProps): JSX.Element => {
  const styles = useThemedStyles(createRecipeChatScreenStyles);
  const { t } = useTranslation();
  const wasConstrained = hasAnyConstraint(recipe.params.constraints ?? NO_CONSTRAINTS);

  return (
    <View style={styles.wrapper}>
      {conversation.messages.length === NOTHING ? (
        <ChatBubble
          message={t(TRANSLATION_KEYS.recipeChatOpening)}
          author={CHAT_AUTHORS.assistant}
        />
      ) : null}
      {conversation.messages.map((message: RecipeChatMessage): JSX.Element => {
        const patch = message.recipePatch;

        return (
          <View key={message.id} style={styles.message}>
            <ChatBubble
              message={message.content}
              author={message.role === CHAT_ROLES.user ? CHAT_AUTHORS.user : CHAT_AUTHORS.assistant}
            />
            {patch === null ? null : (
              <RecipePatchCard
                patch={patch}
                current={recipe.params}
                isApplied={conversation.appliedMessageId === message.id}
                isApplying={conversation.isApplying}
                hasFailed={conversation.applyFailed}
                onApply={(): void => {
                  conversation.applyPatch(message.id, patch);
                }}
              />
            )}
          </View>
        );
      })}
      {wasConstrained ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.recipeChatConstrainedNotice)}
        </Text>
      ) : null}
      <ChatComposer
        isAnswering={conversation.isAnswering}
        hasFailed={conversation.hasFailed}
        onSend={conversation.say}
      />
      <RecipeChatSaveRow recipe={conversation.adjusted ?? recipe} />
    </View>
  );
};
