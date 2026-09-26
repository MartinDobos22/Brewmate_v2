import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX, ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createListItemStyles } from './ListItem.styles';

export interface ListItemProps {
  readonly title: string;
  readonly subtitle?: string;
  /**
   * The subtitle is a figure rather than a sentence, so it is set in the
   * app's numeral face like every other figure. A collar range, a capacity,
   * a dose window - all of them read as measurements and none of them should
   * be proportionally spaced.
   */
  readonly numericSubtitle?: boolean;
  /** A mark in a column of its own before the title. */
  readonly icon?: TileGlyph;
  readonly trailing?: ReactNode;
  readonly onPress?: () => void;
  readonly showDivider?: boolean;
}

/** One row in a list, drawn on whatever it sits on. */
export const ListItem = ({
  title,
  subtitle,
  numericSubtitle = false,
  icon,
  trailing,
  onPress,
  showDivider = false,
}: ListItemProps): JSX.Element => {
  const styles = useThemedStyles(createListItemStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    showDivider && styles.divider,
    pressed && onPress !== undefined && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? 'text' : 'button'}
      accessibilityLabel={title}
    >
      {icon === undefined ? null : (
        <View style={styles.mark}>
          <MaterialCommunityIcons
            name={icon}
            size={theme.size.iconRow}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      )}
      <View style={styles.content}>
        <Text variant="rowTitle">{title}</Text>
        {subtitle === undefined ? null : (
          <Text variant="caption" tone="muted" numeric={numericSubtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing === undefined ? null : <View style={styles.trailing}>{trailing}</View>}
    </Pressable>
  );
};
