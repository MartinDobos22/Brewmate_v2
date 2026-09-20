import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createHomeActionsStyles } from './HomeActions.styles';

export interface HomeLeadActionProps {
  readonly icon: TileGlyph;
  readonly label: string;
  readonly onPress: () => void;
}

/** The one thing the home screen most wants pressed: cream on brown. */
export const HomeLeadAction = ({ icon, label, onPress }: HomeLeadActionProps): JSX.Element => {
  const styles = useThemedStyles(createHomeActionsStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.lead,
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
        color={theme.colors.onCream}
      />
      <Text variant="cardTitle" tone="onCream" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};
