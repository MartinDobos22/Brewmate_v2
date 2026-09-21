import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createBagPhotoStepStyles } from './BagPhotoStep.styles';

export interface BagPhotoActionProps {
  readonly icon: TileGlyph;
  readonly label: string;
  /**
   * What the button is called out loud, where the printed label is an
   * abbreviation of it.
   *
   * Two pills side by side leave room for a word, and "Galéria" is enough to
   * recognise and not enough to be told.
   */
  readonly spokenLabel?: string;
  readonly onPress: () => void;
  /** The camera, which is the one of the three this card is built around. */
  readonly leads?: boolean;
}

/** One way to get a label into the app: the camera, the library, or a keyboard. */
export const BagPhotoAction = ({
  icon,
  label,
  spokenLabel,
  onPress,
  leads = false,
}: BagPhotoActionProps): JSX.Element => {
  const styles = useThemedStyles(createBagPhotoStepStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    leads ? styles.capture : styles.alternative,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={spokenLabel ?? label}
    >
      <MaterialCommunityIcons
        name={icon}
        size={leads ? theme.size.iconLarge : theme.size.iconRow}
        color={leads ? theme.colors.cream : theme.colors.onSurfaceVariant}
      />
      <Text variant={leads ? 'rowTitle' : 'actionLabel'} tone={leads ? 'onCream' : 'default'}>
        {label}
      </Text>
    </Pressable>
  );
};
