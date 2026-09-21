import { useState, type JSX } from 'react';
import { TextInput, View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { useIsOnline } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { CHAT_COMPOSER_ICONS } from '../../constants';
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
  const theme = useTheme();
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const [draft, setDraft] = useState(EMPTY);
  const canSend = draft.trim() !== EMPTY && isOnline && !isAnswering;

  const send = (): void => {
    if (!canSend) {
      return;
    }

    onSend(draft.trim());
    setDraft(EMPTY);
  };

  return (
    <View style={styles.bar}>
      {isOnline && !hasFailed ? null : (
        <View style={styles.notices}>
          {isOnline ? null : (
            <Text variant="bodyMuted" tone="caution">
              {t(TRANSLATION_KEYS.recipeChatOffline)}
            </Text>
          )}
          {hasFailed ? (
            <Text variant="bodyMuted" tone="error">
              {t(TRANSLATION_KEYS.recipeChatError)}
            </Text>
          ) : null}
        </View>
      )}
      <ChatQuickChips disabled={isAnswering} onPick={setDraft} />
      <View style={styles.row}>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={t(
              isAnswering
                ? TRANSLATION_KEYS.recipeChatSending
                : TRANSLATION_KEYS.recipeChatPlaceholder,
            )}
            placeholderTextColor={theme.colors.onDisabled}
            editable={!isAnswering}
            returnKeyType="send"
            onSubmitEditing={send}
            accessibilityLabel={t(TRANSLATION_KEYS.recipeChatInputLabel)}
          />
        </View>
        <PillButton
          tone={canSend ? 'espresso' : 'faint'}
          size="small"
          icon={CHAT_COMPOSER_ICONS.send}
          spokenLabel={t(TRANSLATION_KEYS.recipeChatSend)}
          disabled={!canSend}
          onPress={send}
        />
      </View>
    </View>
  );
};
