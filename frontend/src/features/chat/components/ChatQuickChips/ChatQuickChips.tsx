import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
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
 */
export const ChatQuickChips = ({ disabled, onPick }: ChatQuickChipsProps): JSX.Element => {
  const styles = useThemedStyles(createChatQuickChipsStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const chipStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.chip,
    pressed && !disabled && styles.pressed,
    disabled && styles.disabled,
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}
    >
      {CHAT_QUICK_CHIPS.map((chip: ChatQuickChip): JSX.Element => {
        const label = t(chip.labelKey);

        return (
          <Pressable
            key={chip.labelKey}
            style={chipStyle}
            disabled={disabled}
            onPress={(): void => {
              onPick(t(chip.messageKey));
            }}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            accessibilityLabel={label}
          >
            <MaterialCommunityIcons
              name={chip.icon}
              size={theme.size.iconTiny}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="statusLabel" tone="muted">
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
