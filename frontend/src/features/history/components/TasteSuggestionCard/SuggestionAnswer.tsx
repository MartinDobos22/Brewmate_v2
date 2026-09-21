import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createTasteSuggestionStyles } from './TasteSuggestionCard.styles';

export interface SuggestionAnswerProps {
  readonly icon: TileGlyph;
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled: boolean;
  /** Agreeing, which is cream on brown. Refusing is the lifted brown beside it. */
  readonly agrees?: boolean;
}

/** One of the two answers, both the same size because either is reasonable. */
export const SuggestionAnswer = ({
  icon,
  label,
  onPress,
  disabled,
  agrees = false,
}: SuggestionAnswerProps): JSX.Element => {
  const styles = useThemedStyles(createTasteSuggestionStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    agrees ? styles.accept : styles.dismiss,
    pressed && !disabled && styles.pressed,
    disabled && styles.disabled,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      <MaterialCommunityIcons
        name={icon}
        size={theme.size.iconRow}
        color={agrees ? theme.colors.onCream : theme.colors.onEspressoVariant}
      />
      <Text variant="rowTitle" tone={agrees ? 'onCream' : 'onEspresso'} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};
