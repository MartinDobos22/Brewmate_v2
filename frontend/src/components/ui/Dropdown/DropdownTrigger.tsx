import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createDropdownStyles, dropdownField } from './Dropdown.styles';
import { DROPDOWN_ICONS } from './dropdownIcons';
import type { DropdownOption } from './dropdownOption';

export interface DropdownTriggerProps {
  readonly label: string;
  /** What to print while nothing has been chosen. */
  readonly placeholder: string;
  readonly chosen: DropdownOption | undefined;
  readonly disabled: boolean;
  readonly onPress: () => void;
}

/**
 * The closed dropdown: one answer, and a chevron saying there are others.
 *
 * The chevron is not decoration. A row of text with a border around it reads
 * as something already filled in, and the whole reason this replaced a column
 * of cards is that eighteen brewing methods do not belong on a screen somebody
 * is scrolling through with a kettle boiling.
 */
export const DropdownTrigger = ({
  label,
  placeholder,
  chosen,
  disabled,
  onPress,
}: DropdownTriggerProps): JSX.Element => {
  const styles = useThemedStyles(createDropdownStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    dropdownField(theme),
    pressed && !disabled && styles.pressed,
    disabled && styles.disabled,
  ];

  return (
    <View style={styles.wrapper}>
      <Text variant="eyebrow" tone="muted">
        {label}
      </Text>
      <Pressable
        style={resolveStyle}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: false }}
        accessibilityLabel={label}
        accessibilityValue={{ text: chosen?.label ?? placeholder }}
      >
        {chosen?.icon === undefined ? null : (
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name={chosen.icon}
              size={theme.size.iconMedium}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
        )}
        <View style={styles.value}>
          <Text variant="cardTitle" tone={chosen === undefined ? 'muted' : 'default'}>
            {chosen?.label ?? placeholder}
          </Text>
          {chosen?.note === undefined ? null : (
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {chosen.note}
            </Text>
          )}
        </View>
        <MaterialCommunityIcons
          name={DROPDOWN_ICONS.closed}
          size={theme.size.iconMedium}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>
    </View>
  );
};
