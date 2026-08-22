import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createOptionCardStyles } from './OptionCard.styles';

export interface OptionCardProps {
  readonly label: string;
  /** One short line under the label, for an option that needs explaining. */
  readonly note?: string;
  readonly onPress: () => void;
  readonly selected?: boolean;
  readonly disabled?: boolean;
}

/** A large, single-tap answer: the questionnaire, the water types, the gear. */
export const OptionCard = ({
  label,
  note,
  onPress,
  selected = false,
  disabled = false,
}: OptionCardProps): JSX.Element => {
  const styles = useThemedStyles(createOptionCardStyles);

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    selected ? styles.selected : styles.unselected,
    pressed && !disabled && styles.pressed,
    disabled && styles.disabled,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        <Text variant="titleMedium">{label}</Text>
        {note === undefined ? null : (
          <Text variant="bodySmall" tone="muted">
            {note}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
