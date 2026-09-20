import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import type { TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createHomeActionsStyles } from './HomeActions.styles';

export interface HomeRoundActionProps {
  readonly icon: TileGlyph;
  /** Said out loud rather than printed: the glyph is the whole button. */
  readonly label: string;
  readonly onPress: () => void;
}

/**
 * An alternative beside the lead action, drawn as a glyph and nothing else.
 *
 * These two - quick brewing and the scanner - are the doors a brand-new
 * account can walk through without owning anything, and they belong beside
 * the recommendation rather than below it. Round and unlabelled because a
 * third and fourth label on this row would make three equal choices out of
 * one answer and two alternatives.
 */
export const HomeRoundAction = ({ icon, label, onPress }: HomeRoundActionProps): JSX.Element => {
  const styles = useThemedStyles(createHomeActionsStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.round,
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
        size={theme.size.iconLarge}
        color={theme.colors.accentSoft}
      />
    </Pressable>
  );
};
