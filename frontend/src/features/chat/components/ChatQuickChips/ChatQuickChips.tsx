import type { JSX } from 'react';
import { ScrollView } from 'react-native';

import { Chip } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { CHAT_QUICK_CHIPS, type ChatQuickChip } from '../../constants';

import { createChatQuickChipsStyles } from './ChatQuickChips.styles';

export interface ChatQuickChipsProps {
  readonly disabled: boolean;
  readonly onPick: (message: string) => void;
}

/**
 * Shortcuts to writing a message, not a menu of answers.
 *
 * Each one sends an ordinary Slovak sentence in the first person, exactly as
 * somebody might have typed it - so the conversation reads the same whether
 * they tapped or wrote, and the model is never handed a code word it has to
 * decode. They sit above the input rather than instead of it: the whole point
 * of asking an open question is that the interesting answers are the ones
 * nobody anticipated.
 *
 * They are the shared pill rather than a private copy of it, and they carry
 * no `selected` for the reason above - nothing here is chosen, a chip fills
 * the box and the box is what answers.
 */
export const ChatQuickChips = ({ disabled, onPick }: ChatQuickChipsProps): JSX.Element => {
  const styles = useThemedStyles(createChatQuickChipsStyles);
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}
    >
      {CHAT_QUICK_CHIPS.map((chip: ChatQuickChip): JSX.Element => (
        <Chip
          key={chip.labelKey}
          label={t(chip.labelKey)}
          icon={chip.icon}
          disabled={disabled}
          onPress={(): void => {
            onPick(t(chip.messageKey));
          }}
        />
      ))}
    </ScrollView>
  );
};
