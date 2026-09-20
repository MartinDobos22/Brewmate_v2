import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createNumberStepperStyles } from './NumberStepper.styles';
import { CalculatorValue } from './CalculatorValue';
import { STEPPER_ICONS } from './stepperSymbols';

export interface CalculatorStepperProps {
  readonly label: string;
  readonly icon: TileGlyph;
  /** Already formatted by one of the formatters in lib/formatters. */
  readonly formattedValue: string;
  readonly unit: string;
  readonly onDecrease: () => void;
  readonly onIncrease: () => void;
  readonly decreaseLabel: string;
  readonly increaseLabel: string;
  readonly onChangeValue: (value: number) => void;
}

/**
 * One line of the calculator: a figure with a button either side of it.
 *
 * The figure is the largest thing on its screen because it is what somebody
 * came to adjust, and its name sits underneath rather than above - a caption
 * over a number this size reads as a heading for the whole card.
 */
export const CalculatorStepper = ({
  label,
  icon,
  formattedValue,
  unit,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  onChangeValue,
}: CalculatorStepperProps): JSX.Element => {
  const styles = useThemedStyles(createNumberStepperStyles);
  const theme = useTheme();

  const decreaseStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.calculatorButton,
    styles.calculatorDecrease,
    pressed && styles.pressed,
  ];

  const increaseStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.calculatorButton,
    styles.calculatorIncrease,
    pressed && styles.pressed,
  ];

  return (
    <View style={styles.calculatorRow}>
      <Pressable
        style={decreaseStyle}
        onPress={onDecrease}
        accessibilityRole="button"
        accessibilityLabel={decreaseLabel}
      >
        <MaterialCommunityIcons
          name={STEPPER_ICONS.decrease}
          size={theme.size.iconMedium}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>
      <View style={styles.calculatorValue}>
        <CalculatorValue
          formattedValue={formattedValue}
          unit={unit}
          editLabel={label}
          onChangeValue={onChangeValue}
        />
        <View style={styles.calculatorLabel}>
          <MaterialCommunityIcons
            name={icon}
            size={theme.size.iconTiny}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="eyebrow" tone="muted">
            {label}
          </Text>
        </View>
      </View>
      <Pressable
        style={increaseStyle}
        onPress={onIncrease}
        accessibilityRole="button"
        accessibilityLabel={increaseLabel}
      >
        <MaterialCommunityIcons
          name={STEPPER_ICONS.increase}
          size={theme.size.iconMedium}
          color={theme.colors.cream}
        />
      </Pressable>
    </View>
  );
};
