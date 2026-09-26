import { useState, type JSX } from 'react';
import { TextInput, View } from 'react-native';

import { parseDecimal } from '../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createNumberStepperStyles } from './NumberStepper.styles';

export interface CalculatorValueProps {
  /** Already formatted by one of the formatters in lib/formatters. */
  readonly formattedValue: string;
  readonly unit: string;
  readonly editLabel: string;
  readonly onChangeValue: (value: number) => void;
}

/**
 * The figure between the two buttons, typed as well as stepped.
 *
 * Stepping alone is fine for a dose, which moves half a gram at a time and
 * starts near where it is going. It is not fine for the water: the water is
 * the dose times the ratio, so it lands on 229,6 and every press of a button
 * moves the ratio rather than the weight.
 *
 * While the field has focus it holds whatever was typed, not what the value
 * rounds to. Reformatting mid-word is how a field eats the comma somebody just
 * pressed. An emptied field changes nothing until there are digits in it
 * again: deleting three characters before typing the replacement does not mean
 * a dose of nought.
 */
export const CalculatorValue = ({
  formattedValue,
  unit,
  editLabel,
  onChangeValue,
}: CalculatorValueProps): JSX.Element => {
  const styles = useThemedStyles(createNumberStepperStyles);
  const theme = useTheme();
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <View style={styles.editable}>
      <TextInput
        style={styles.calculatorField}
        value={draft ?? formattedValue}
        keyboardType="decimal-pad"
        selectTextOnFocus
        accessibilityLabel={editLabel}
        selectionColor={theme.colors.primary}
        onFocus={(): void => {
          setDraft(formattedValue);
        }}
        onBlur={(): void => {
          setDraft(null);
        }}
        onChangeText={(next: string): void => {
          setDraft(next);

          const parsed = parseDecimal(next);

          if (parsed !== null) {
            onChangeValue(parsed);
          }
        }}
      />
      <Text variant="unitLarge" tone="muted">
        {unit}
      </Text>
    </View>
  );
};
