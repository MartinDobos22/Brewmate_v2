import { useState, type JSX } from 'react';
import { TextInput, View } from 'react-native';

import { parseDecimal } from '../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createNumberStepperStyles } from './NumberStepper.styles';

export interface NumberStepperValueProps {
  /** Already formatted by one of the formatters in lib/formatters. */
  readonly formattedValue: string;
  readonly unit?: string;
  /** Present only where the number may be typed as well as stepped. */
  readonly onChangeValue?: (value: number) => void;
  readonly editLabel: string;
}

/**
 * The number between the two buttons, typed as well as stepped where it makes
 * sense.
 *
 * Stepping alone is fine for a dose, which moves half a gram at a time and
 * starts near where it is going. It is not fine for the water: the water is
 * the dose times the ratio, so it lands on 229,6 and every press of a button
 * moves the ratio rather than the weight. Somebody who wants 230 grams has to
 * hunt for it through a number that never stops at a round figure, and the
 * obvious thing to do - type it - was the one thing the control did not allow.
 *
 * While the field has focus it holds whatever was typed, not what the value
 * rounds to. Reformatting mid-word is how a field eats the comma somebody just
 * pressed, and a field that argues with the keypad is worse than no field. An
 * emptied field changes nothing until there are digits in it again: deleting
 * three characters before typing the replacement does not mean a dose of
 * nought.
 */
export const NumberStepperValue = ({
  formattedValue,
  unit,
  onChangeValue,
  editLabel,
}: NumberStepperValueProps): JSX.Element => {
  const styles = useThemedStyles(createNumberStepperStyles);
  const theme = useTheme();
  const [draft, setDraft] = useState<string | null>(null);

  if (onChangeValue === undefined) {
    return (
      <Text variant="numericLarge" numeric numberOfLines={1}>
        {unit === undefined ? formattedValue : `${formattedValue} ${unit}`}
      </Text>
    );
  }

  return (
    <View style={styles.editable}>
      <TextInput
        style={styles.field}
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
      {unit === undefined ? null : (
        <Text variant="numericLarge" numeric>
          {unit}
        </Text>
      )}
    </View>
  );
};
