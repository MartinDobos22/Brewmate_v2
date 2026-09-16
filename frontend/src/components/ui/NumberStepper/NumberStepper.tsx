import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createNumberStepperStyles } from './NumberStepper.styles';
import { NumberStepperValue } from './NumberStepperValue';
import { STEPPER_SYMBOLS } from './stepperSymbols';

export interface NumberStepperProps {
  readonly label: string;
  /** Already formatted by one of the formatters in lib/formatters. */
  readonly formattedValue: string;
  readonly unit?: string;
  readonly onDecrease: () => void;
  readonly onIncrease: () => void;
  readonly decreaseLabel: string;
  readonly increaseLabel: string;
  readonly canDecrease?: boolean;
  readonly canIncrease?: boolean;
  /**
   * Lets the number be typed as well as stepped.
   *
   * Left out, the value is read-only text, which is right where the steps
   * land on the figures somebody wants anyway. Supplied, the control also
   * accepts a number straight from the keypad - the case for it is a water
   * weight, which is a dose times a ratio and therefore almost never a round
   * number a button can reach.
   */
  readonly onChangeValue?: (value: number) => void;
  /** What the typed field is called to a screen reader. Required with `onChangeValue`. */
  readonly editLabel?: string;
}

export const NumberStepper = ({
  label,
  formattedValue,
  unit,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  canDecrease = true,
  canIncrease = true,
  onChangeValue,
  editLabel = label,
}: NumberStepperProps): JSX.Element => {
  const styles = useThemedStyles(createNumberStepperStyles);

  const resolveStyle =
    (enabled: boolean) =>
    ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
      styles.button,
      pressed && enabled && styles.pressed,
      !enabled && styles.disabled,
    ];

  return (
    <View style={styles.wrapper}>
      <Text variant="labelMedium" tone="muted">
        {label}
      </Text>
      <View style={styles.row}>
        <Pressable
          style={resolveStyle(canDecrease)}
          onPress={onDecrease}
          disabled={!canDecrease}
          accessibilityRole="button"
          accessibilityLabel={decreaseLabel}
        >
          <Text variant="titleLarge">{STEPPER_SYMBOLS.decrease}</Text>
        </Pressable>
        <View style={styles.value}>
          <NumberStepperValue
            formattedValue={formattedValue}
            unit={unit}
            onChangeValue={onChangeValue}
            editLabel={editLabel}
          />
        </View>
        <Pressable
          style={resolveStyle(canIncrease)}
          onPress={onIncrease}
          disabled={!canIncrease}
          accessibilityRole="button"
          accessibilityLabel={increaseLabel}
        >
          <Text variant="titleLarge">{STEPPER_SYMBOLS.increase}</Text>
        </Pressable>
      </View>
    </View>
  );
};
