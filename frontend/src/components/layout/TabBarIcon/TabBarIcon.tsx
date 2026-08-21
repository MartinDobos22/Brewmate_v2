import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps, JSX } from 'react';
import type { ColorValue } from 'react-native';

import { useTheme } from '../../../theme';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface TabBarIconProps {
  readonly name: GlyphName;
  readonly color: ColorValue;
}

/** One tab glyph, sized from the token scale. */
export const TabBarIcon = ({ name, color }: TabBarIconProps): JSX.Element => {
  const theme = useTheme();

  return <MaterialCommunityIcons name={name} color={color} size={theme.size.iconMedium} />;
};
