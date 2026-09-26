import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text, type TextTone, type TextVariant } from '../Text';
import type { TileGlyph } from '../Tile';

import { chipDisabled, chipPill, createChipStyles } from './Chip.styles';
import {
  CHIP_ICON_COLORS,
  CHIP_LABEL_TONES,
  CHIP_LABEL_VARIANTS,
  DEFAULT_CHIP_SIZE,
  DEFAULT_CHIP_TONE,
  type ChipSize,
  type ChipTone,
} from './chipTones';

const CHOICE_LABEL_VARIANT: TextVariant = 'actionLabel';

export interface ChipProps {
  readonly label: string;
  /** A small mark before the label, where the thing it names has one. */
  readonly icon?: TileGlyph;
  /**
   * Naming this at all is what makes the chip a control.
   *
   * A chip that takes part in a selection has two things to say and keeps the
   * square-ish radius the rest of this app's controls have; one that does not
   * is a fact or a shortcut and is drawn as a pill. Pressing is a separate
   * question - a shortcut that fills a box is pressed and never stays chosen.
   */
  readonly selected?: boolean;
  readonly onPress?: () => void;
  /** Read only by the pill kind; a selection paints itself. */
  readonly tone?: ChipTone;
  readonly size?: ChipSize;
  readonly disabled?: boolean;
}

const resolveChoiceTone = (selected: boolean, disabled: boolean): TextTone => {
  if (disabled) {
    return 'disabled';
  }

  return selected ? 'onPrimaryContainer' : 'muted';
};

/** A single-choice or filter token - or, with no selection, a fact or a shortcut. */
export const Chip = ({
  label,
  icon,
  selected,
  onPress,
  tone = DEFAULT_CHIP_TONE,
  size = DEFAULT_CHIP_SIZE,
  disabled = false,
}: ChipProps): JSX.Element => {
  const styles = useThemedStyles(createChipStyles);
  const theme = useTheme();
  const isChoice = selected !== undefined;

  const shape = isChoice
    ? [styles.choice, selected ? styles.selected : styles.unselected]
    : [chipPill(theme, tone, size)];

  const body = (
    <>
      {icon === undefined ? null : (
        <MaterialCommunityIcons
          name={icon}
          size={theme.size.iconTiny}
          color={
            isChoice && selected
              ? theme.colors.onPrimaryContainer
              : theme.colors[isChoice ? 'onSurfaceVariant' : CHIP_ICON_COLORS[tone]]
          }
        />
      )}
      <Text
        variant={isChoice ? CHOICE_LABEL_VARIANT : CHIP_LABEL_VARIANTS[size]}
        tone={isChoice ? resolveChoiceTone(selected, disabled) : CHIP_LABEL_TONES[tone]}
      >
        {label}
      </Text>
    </>
  );

  if (onPress === undefined) {
    return <View style={[styles.base, ...shape]}>{body}</View>;
  }

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    ...shape,
    pressed && !disabled && styles.pressed,
    disabled && chipDisabled(theme),
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
      {body}
    </Pressable>
  );
};
