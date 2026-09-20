import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps, JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_CONTROL_ICONS } from '../../constants';

import { createBrewControlsStyles } from './BrewControls.styles';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface BrewControlButtonProps {
  readonly icon: GlyphName;
  readonly label: string;
  /** The one in the middle, which is bigger, cream, and reads its label large. */
  readonly isPrimary?: boolean;
  readonly onPress: () => void;
}

/**
 * One control. Both kinds are an icon over a word, because at arm's length the
 * icon is what is found and the word is what confirms it.
 */
export const BrewControlButton = ({
  icon,
  label,
  isPrimary = false,
  onPress,
}: BrewControlButtonProps): JSX.Element => {
  const styles = useThemedStyles(createBrewControlsStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    isPrimary ? styles.primary : styles.secondary,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <MaterialCommunityIcons
        name={icon}
        size={isPrimary ? BREW_CONTROL_ICONS.primarySize : BREW_CONTROL_ICONS.secondarySize}
        color={isPrimary ? theme.colors.onCream : theme.colors.onEspressoVariant}
      />
      <Text
        variant={isPrimary ? 'actionLarge' : 'controlLabel'}
        tone={isPrimary ? 'onCream' : 'onEspressoMuted'}
        align="center"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
};
