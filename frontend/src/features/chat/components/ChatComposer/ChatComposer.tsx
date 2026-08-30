import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button, Input, Text } from '../../../../components/ui';
import { useIsOnline } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ChatQuickChips } from '../ChatQuickChips';

import { createChatComposerStyles } from './ChatComposer.styles';

export interface ChatComposerProps {
  readonly isAnswering: boolean;
  readonly hasFailed: boolean;
  readonly onSend: (message: string) => void;
}

const EMPTY = '';

/**
 * Where somebody says how the coffee was.
 *
 * A chip fills the box rather than sending straight away, so a shortcut is
 * still something they can look at and change - "menej kyslé" plus "a bola aj
 * slabá" is a better message than either half, and a chip that fired on tap
 * would have thrown the second half away.
 *
 * Being offline is said before the attempt rather than after it: a request
 * that never left the phone failed for a reason somebody can see out of the
 * window.
 */
export const ChatComposer = ({
  isAnswering,
  hasFailed,
  onSend,
}: ChatComposerProps): JSX.Element => {
  const styles = useThemedStyles(createChatComposerStyles);
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const [draft, setDraft] = useState(EMPTY);

  const send = (): void => {
    if (draft.trim() === EMPTY) {
      return;
    }

    onSend(draft.trim());
    setDraft(EMPTY);
  };

  return (
    <View style={styles.wrapper}>
      <ChatQuickChips disabled={isAnswering} onPick={setDraft} />
      <Input
        label={t(TRANSLATION_KEYS.recipeChatInputLabel)}
        placeholder={t(TRANSLATION_KEYS.recipeChatPlaceholder)}
        value={draft}
        onChangeText={setDraft}
        disabled={isAnswering}
      />
      {isOnline ? null : (
        <Text variant="bodySmall" tone="tertiary">
          {t(TRANSLATION_KEYS.recipeChatOffline)}
        </Text>
      )}
      {hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.recipeChatError)}
        </Text>
      ) : null}
      <Button
        label={t(
          isAnswering ? TRANSLATION_KEYS.recipeChatSending : TRANSLATION_KEYS.recipeChatSend,
        )}
        fullWidth
        loading={isAnswering}
        disabled={draft.trim() === EMPTY || !isOnline}
        onPress={send}
      />
    </View>
  );
};
