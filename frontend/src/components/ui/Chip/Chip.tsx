import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text, type TextTone } from '../Text';

import { createChipStyles } from './Chip.styles';

export interface ChipProps {
  readonly label: string;
  /** Absent makes this a fact rather than a control, and nothing is pressable. */
  readonly onPress?: () => void;
  readonly selected?: boolean;
  readonly disabled?: boolean;
}

const resolveTone = (selected: boolean, disabled: boolean): TextTone => {
  if (disabled) {
    return 'disabled';
  }

  return selected ? 'secondary' : 'muted';
};

/**
 * A single-choice or filter token - or, with no `onPress`, a fact.
 *
 * The second is what the redesign prints a roast level and a process on: it is
 * a label rather than an answer, so it is not a button, does not report itself
 * as one, and is shaped as a small pill instead of as a control.
 */
export const Chip = ({
  label,
  onPress,
  selected = false,
  disabled = false,
}: ChipProps): JSX.Element => {
  const styles = useThemedStyles(createChipStyles);

  if (onPress === undefined) {
    return (
      <View style={[styles.base, styles.attribute]}>
        <Text variant="chipLabel">{label}</Text>
      </View>
    );
  }

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
