import { useState, type JSX } from 'react';
import { TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createInputStyles } from './Input.styles';

export interface InputProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder?: string;
  readonly helpText?: string;
  readonly errorText?: string;
  /**
   * Marks a value the app filled in but is not sure of - a field read off a
   * photograph in bad light. Distinct from an error: nothing is wrong, it is
   * simply worth a glance before it is saved.
   */
  readonly unverified?: boolean;
  readonly disabled?: boolean;
  readonly keyboardType?: KeyboardTypeOptions;
  /** Masks the value. Also opts the field out of autocorrect and suggestions. */
  readonly secureTextEntry?: boolean;
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  /** Lets the platform offer the right saved value - an e-mail, a password. */
  readonly autoComplete?: TextInputProps['autoComplete'];
  readonly textContentType?: TextInputProps['textContentType'];
}

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  helpText,
  errorText,
  unverified = false,
  disabled = false,
  keyboardType,
  secureTextEntry = false,
  autoCapitalize,
  autoComplete,
  textContentType,
}: InputProps): JSX.Element => {
  const styles = useThemedStyles(createInputStyles);
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const hasError = errorText !== undefined;

  return (
    <View style={styles.wrapper}>
      <Text variant="labelMedium" tone="muted">
        {label}
      </Text>
      <View
        style={[
          styles.field,
          unverified && !hasError && styles.unverified,
          focused && !hasError && styles.focused,
          hasError && styles.errored,
          disabled && styles.disabled,
        ]}
      >
        <TextInput
          style={styles.text}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onDisabled}
          editable={!disabled}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          autoCorrect={!secureTextEntry}
          accessibilityLabel={label}
          onFocus={(): void => {
            setFocused(true);
          }}
          onBlur={(): void => {
            setFocused(false);
          }}
        />
      </View>
      {hasError ? (
        <Text variant="bodySmall" tone="error">
          {errorText}
        </Text>
      ) : null}
      {!hasError && helpText !== undefined ? (
        <Text variant="bodySmall" tone={unverified ? 'tertiary' : 'muted'}>
          {helpText}
        </Text>
      ) : null}
    </View>
  );
};
