import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type JSX } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createInputStyles, inputBox, inputDisabled, inputText } from './Input.styles';
import { INPUT_REVEAL_ICONS } from './inputRevealIcons';
import {
  DEFAULT_INPUT_GROUND,
  INPUT_HELP_TONES,
  INPUT_LABEL_ICON_COLORS,
  INPUT_LABEL_TONES,
  INPUT_PLACEHOLDER_COLORS,
  resolveInputRing,
  type InputGround,
} from './inputGrounds';

/** The one `autoCapitalize` value that also says the content is not prose. */
const NO_CAPITALS: TextInputProps['autoCapitalize'] = 'none';

export interface InputProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  /** A small glyph beside the label, where the field is worth marking. */
  readonly icon?: TileGlyph;
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
  /** What a field is standing on. Named only by the signed-out screens. */
  readonly ground?: InputGround;
  /**
   * Masks the value and offers the eye that unmasks it.
   *
   * Both halves, because they are one feature: a password typed wrong on a
   * keyboard that capitalised the first letter is answered by a failure
   * nobody can see the cause of.
   */
  readonly secret?: boolean;
  readonly keyboardType?: TextInputProps['keyboardType'];
  /**
   * Also decides autocorrect, because the two answer one question.
   *
   * A field told not to capitalise its first letter is a field holding
   * something that is not language - an address, a search term, a model
   * number - and every one of those is made worse by a dictionary. Left to
   * the platform, a keyboard helpfully turns "v60" into "V60." and an
   * e-mail into a sentence.
   */
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  /** Lets the platform offer the right saved value - an e-mail, a password. */
  readonly autoComplete?: TextInputProps['autoComplete'];
  readonly textContentType?: TextInputProps['textContentType'];
  /**
   * A box for a paragraph rather than for a value.
   *
   * One field in this app is handed a whole recipe pasted out of a video
   * description, and at the single height every other field shares it showed
   * two lines of its own placeholder with the second one sliced in half. A
   * pasted recipe is several lines by definition, so the box grows from that
   * shared height instead of being fixed at it.
   */
  readonly multiline?: boolean;
}

/** Every text field in the app, on either of the two grounds it can stand on. */
export const Input = ({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  helpText,
  errorText,
  unverified = false,
  disabled = false,
  ground = DEFAULT_INPUT_GROUND,
  secret = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  multiline = false,
}: InputProps): JSX.Element => {
  const styles = useThemedStyles(createInputStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasError = errorText !== undefined;
  const ring = resolveInputRing({ ground, hasError, unverified, focused });

  return (
    <View style={styles.wrapper}>
      <View style={styles.label}>
        {icon === undefined ? null : (
          <MaterialCommunityIcons
            name={icon}
            size={theme.size.iconTiny}
            color={theme.colors[INPUT_LABEL_ICON_COLORS[ground]]}
          />
        )}
        <Text variant="eyebrow" tone={INPUT_LABEL_TONES[ground]}>
          {label}
        </Text>
      </View>
      <View style={[inputBox(theme, ground, ring, multiline), disabled && inputDisabled(theme)]}>
        <TextInput
          style={inputText(theme, ground, multiline)}
          multiline={multiline}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors[INPUT_PLACEHOLDER_COLORS[ground]]}
          editable={!disabled}
          keyboardType={keyboardType}
          secureTextEntry={secret && !revealed}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          autoCorrect={!secret && autoCapitalize !== NO_CAPITALS}
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
              name={revealed ? INPUT_REVEAL_ICONS.conceal : INPUT_REVEAL_ICONS.reveal}
              size={theme.size.iconLarge}
              color={theme.colors[INPUT_LABEL_ICON_COLORS[ground]]}
            />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text variant="captionSmall" tone="error">
          {errorText}
        </Text>
      ) : null}
      {!hasError && helpText !== undefined ? (
        <Text variant="captionSmall" tone={unverified ? 'tertiary' : INPUT_HELP_TONES[ground]}>
          {helpText}
        </Text>
      ) : null}
    </View>
  );
};
