import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createNumberStepperStyles } from './NumberStepper.styles';
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
          <Text variant="numericLarge" numeric>
            {unit === undefined ? formattedValue : `${formattedValue} ${unit}`}
          </Text>
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
