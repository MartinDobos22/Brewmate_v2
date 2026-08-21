import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text, type TextTone } from '../Text';

import { createChipStyles } from './Chip.styles';

export interface ChipProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly selected?: boolean;
  readonly disabled?: boolean;
}

const resolveTone = (selected: boolean, disabled: boolean): TextTone => {
  if (disabled) {
    return 'disabled';
  }

  return selected ? 'secondary' : 'muted';
};

/** A single-choice or filter token. */
export const Chip = ({
  label,
  onPress,
  selected = false,
  disabled = false,
}: ChipProps): JSX.Element => {
  const styles = useThemedStyles(createChipStyles);

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
      <Text variant="labelMedium" tone={resolveTone(selected, disabled)}>
        {label}
      </Text>
    </Pressable>
  );
};
