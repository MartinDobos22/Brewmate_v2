import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type JSX } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { AUTH_ICONS } from '../../constants';

import { createAuthFieldStyles } from './AuthField.styles';

export interface AuthFieldProps {
  readonly label: string;
  readonly icon: TileGlyph;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder: string;
  readonly errorText?: string;
  readonly disabled?: boolean;
  /** Masks the value and offers the eye that unmasks it. */
  readonly secret?: boolean;
  readonly keyboardType?: TextInputProps['keyboardType'];
  readonly autoComplete?: TextInputProps['autoComplete'];
  readonly textContentType?: TextInputProps['textContentType'];
}

/**
 * One box on a signed-out screen, with its own label above it.
 *
 * A password can be revealed, which is the one thing every masked field on a
 * phone needs and the shared `Input` has never offered: an address typed wrong
 * is answered by the server, and a password typed wrong on a keyboard that
 * capitalised the first letter is answered by a failure nobody can see the
 * cause of.
 */
export const AuthField = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  errorText,
  disabled = false,
  secret = false,
  keyboardType,
  autoComplete,
  textContentType,
}: AuthFieldProps): JSX.Element => {
  const styles = useThemedStyles(createAuthFieldStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasError = errorText !== undefined;

  return (
    <View style={styles.wrapper}>
      <View style={styles.label}>
        <MaterialCommunityIcons
          name={icon}
          size={theme.size.iconTiny}
          color={theme.colors.onEspressoVariant}
        />
        <Text variant="eyebrow" tone="onEspressoMuted">
          {label}
        </Text>
      </View>
      <View
        style={[styles.box, focused && !hasError && styles.focused, hasError && styles.errored]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onEspressoVariant}
          editable={!disabled}
          secureTextEntry={secret && !revealed}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          textContentType={textContentType}
          accessibilityLabel={label}
          onFocus={(): void => {
            setFocused(true);
          }}
          onBlur={(): void => {
            setFocused(false);
          }}
        />
        {secret ? (
          <Pressable
            style={styles.reveal}
            onPress={(): void => {
              setRevealed(!revealed);
            }}
            accessibilityRole="button"
            accessibilityState={{ checked: revealed }}
            accessibilityLabel={t(
              revealed ? TRANSLATION_KEYS.authConcealPassword : TRANSLATION_KEYS.authRevealPassword,
            )}
          >
            <MaterialCommunityIcons
              name={revealed ? AUTH_ICONS.conceal : AUTH_ICONS.reveal}
              size={theme.size.iconLarge}
              color={theme.colors.onEspressoVariant}
            />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text variant="captionSmall" tone="error">
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};
